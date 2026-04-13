<?php
// TEMPORARY DIAGNOSTIC v2 — lists calendars the SA can see.
// Token-protected, delete after verification.

header('Content-Type: application/json; charset=utf-8');

$token = $_GET['t'] ?? '';
if ($token !== 'diag-2026-04-13-notary') {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit;
}

@include __DIR__ . '/google-config.php';
require_once __DIR__ . '/gcal-auth.php';

$out = [];

$saToken = gcalServiceAccountToken('https://www.googleapis.com/auth/calendar');
$out['sa_token_obtained'] = !!$saToken;
$out['current_GOOGLE_CALENDAR_ID_in_config'] = defined('GOOGLE_CALENDAR_ID') ? GOOGLE_CALENDAR_ID : null;

if (!$saToken) {
    echo json_encode($out, JSON_PRETTY_PRINT);
    exit;
}

// 1. List calendars visible to the Service Account
$ch = curl_init('https://www.googleapis.com/calendar/v3/users/me/calendarList');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $saToken],
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_SSL_VERIFYPEER => true,
]);
$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$out['calendarList_http']    = $code;
$calList = json_decode($res, true);
$out['calendarList_count']   = isset($calList['items']) ? count($calList['items']) : 0;
$out['calendarList_summary'] = [];
if (isset($calList['items'])) {
    foreach ($calList['items'] as $cal) {
        $out['calendarList_summary'][] = [
            'id'           => $cal['id'] ?? null,
            'summary'      => $cal['summary'] ?? null,
            'primary'      => $cal['primary'] ?? false,
            'accessRole'   => $cal['accessRole'] ?? null,
        ];
    }
}

// 2. Try events.list on a list of candidate calendar IDs for a 14-day window
$candidateIds = [];
if (defined('GOOGLE_CALENDAR_ID')) $candidateIds[] = GOOGLE_CALENDAR_ID;
$candidateIds[] = 'notaryaplus31@gmail.com';
$candidateIds[] = 'primary';
// Also try every ID we saw in calendarList
if (isset($calList['items'])) {
    foreach ($calList['items'] as $cal) {
        if (!empty($cal['id'])) $candidateIds[] = $cal['id'];
    }
}
$candidateIds = array_values(array_unique($candidateIds));

$out['candidate_ids_tried'] = $candidateIds;
$out['events_probe'] = [];

$timeMin = date('c', strtotime('2026-04-13 00:00:00'));
$timeMax = date('c', strtotime('2026-04-27 23:59:59'));

foreach ($candidateIds as $cid) {
    $url = 'https://www.googleapis.com/calendar/v3/calendars/' . urlencode($cid) . '/events'
        . '?timeMin=' . urlencode($timeMin)
        . '&timeMax=' . urlencode($timeMax)
        . '&singleEvents=true&orderBy=startTime&maxResults=50';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $saToken],
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $data = json_decode($res, true);
    $probe = ['id' => $cid, 'http' => $code];
    if ($code === 200 && isset($data['items'])) {
        $probe['event_count'] = count($data['items']);
        $probe['first_5_starts'] = [];
        $n = 0;
        foreach ($data['items'] as $ev) {
            $probe['first_5_starts'][] = $ev['start']['dateTime'] ?? $ev['start']['date'] ?? '?';
            if (++$n >= 5) break;
        }
    } else {
        $probe['error'] = $data['error']['message'] ?? $data['error'] ?? 'unknown';
    }
    $out['events_probe'][] = $probe;
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
