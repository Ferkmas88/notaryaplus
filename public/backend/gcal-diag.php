<?php
// TEMPORARY DIAGNOSTIC v3 — per-calendar freeBusy probe.
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

if (!$saToken) {
    echo json_encode($out, JSON_PRETTY_PRINT);
    exit;
}

// Probe each calendar individually for April 14 (the day in the screenshots)
$calendars = [
    'notaryaplus31@gmail.com',
    '2025e3f6e24a55cee2d0d08205baa9d571bbe0a93aa72157115fef122af071a4@group.calendar.google.com',
    'ale.notaryaplus@gmail.com',
    'cecilia1.notaryaplus@gmail.com',
    'danae.notaryaplus@gmail.com',
    // Also try dot-less gmail variants (gmail ignores dots)
    'alenotaryaplus@gmail.com',
    'cecilia1notaryaplus@gmail.com',
    'danaenotaryaplus@gmail.com',
];

$tz = new DateTimeZone('America/Kentucky/Louisville');
$dtMin = new DateTime('2026-04-14 00:00:00', $tz);
$dtMax = new DateTime('2026-04-14 23:59:59', $tz);
$timeMin = $dtMin->format(DateTime::RFC3339);
$timeMax = $dtMax->format(DateTime::RFC3339);

$out['probes'] = [];
foreach ($calendars as $cid) {
    $probe = ['id' => $cid];

    // 1. events.list
    $url = 'https://www.googleapis.com/calendar/v3/calendars/' . urlencode($cid) . '/events'
        . '?timeMin=' . urlencode($timeMin)
        . '&timeMax=' . urlencode($timeMax)
        . '&singleEvents=true&orderBy=startTime&maxResults=20';
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
    $d = json_decode($res, true);

    if ($code === 200 && isset($d['items'])) {
        $probe['events_http']  = 200;
        $probe['events_count'] = count($d['items']);
        $probe['event_starts'] = [];
        foreach ($d['items'] as $ev) {
            $probe['event_starts'][] = $ev['start']['dateTime'] ?? $ev['start']['date'] ?? '?';
        }
    } else {
        $probe['events_http']  = $code;
        $probe['events_error'] = $d['error']['message'] ?? $d['error'] ?? 'unknown';
    }

    $out['probes'][] = $probe;
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
