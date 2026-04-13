<?php
// TEMPORARY DIAGNOSTIC — delete this file after verification.
// Token-protected to avoid leaking info publicly.

header('Content-Type: application/json; charset=utf-8');

$token = $_GET['t'] ?? '';
if ($token !== 'diag-2026-04-13-notary') {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit;
}

@include __DIR__ . '/google-config.php';
require_once __DIR__ . '/gcal-auth.php';
require_once __DIR__ . '/citas.php'; // to reuse curlPost (header() calls already sent above are fine)

$out = [];

// 1. Where is service-account.json?
$candidates = [
    __DIR__ . '/../../../service-account.json',
    __DIR__ . '/../../service-account.json',
    __DIR__ . '/service-account.json',
];
$out['candidate_paths'] = [];
foreach ($candidates as $p) {
    $out['candidate_paths'][] = [
        'path'     => $p,
        'exists'   => is_file($p),
        'readable' => is_file($p) && is_readable($p),
    ];
}

$keyPath = gcalServiceAccountKeyPath();
$out['resolved_key_path'] = $keyPath;

// 2. Parse the key (without leaking the private_key)
if ($keyPath) {
    $raw = file_get_contents($keyPath);
    $key = json_decode($raw, true);
    $out['key_has_private_key']  = !empty($key['private_key']);
    $out['key_client_email']     = $key['client_email'] ?? null;
    $out['key_project_id']       = $key['project_id'] ?? null;
    $out['key_type']             = $key['type'] ?? null;
    $out['key_token_uri']        = $key['token_uri'] ?? null;
}

// 3. Try to get a Service Account token
$saToken = gcalServiceAccountToken('https://www.googleapis.com/auth/calendar.events');
$out['sa_token_obtained'] = !!$saToken;
$out['sa_token_preview']  = $saToken ? substr($saToken, 0, 20) . '...' : null;

// 4. Try to use it to call freeBusy for a date we know Myrna has events
$calId = defined('GOOGLE_CALENDAR_ID') ? GOOGLE_CALENDAR_ID : null;
$out['google_calendar_id_in_config'] = $calId;

if ($saToken && $calId) {
    $tz = new DateTimeZone('America/Kentucky/Louisville');
    $dtMin = new DateTime('2026-04-15 00:00:00', $tz);
    $dtMax = new DateTime('2026-04-15 23:59:59', $tz);
    $body = json_encode([
        'timeMin'  => $dtMin->format(DateTime::RFC3339),
        'timeMax'  => $dtMax->format(DateTime::RFC3339),
        'timeZone' => 'America/Kentucky/Louisville',
        'items'    => [['id' => $calId]],
    ]);
    $ch = curl_init('https://www.googleapis.com/calendar/v3/freeBusy');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'Authorization: Bearer ' . $saToken],
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $out['sa_freebusy_http'] = $code;
    $out['sa_freebusy_raw']  = json_decode($res, true);
}

// 5. Try events.list (more info than freeBusy)
if ($saToken && $calId) {
    $eventsUrl = 'https://www.googleapis.com/calendar/v3/calendars/' . urlencode($calId) . '/events'
        . '?timeMin=' . urlencode('2026-04-15T00:00:00-04:00')
        . '&timeMax=' . urlencode('2026-04-16T23:59:59-04:00')
        . '&singleEvents=true&orderBy=startTime';
    $ch = curl_init($eventsUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $saToken],
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $out['sa_events_http']   = $code;
    $events = json_decode($res, true);
    $out['sa_events_count']  = isset($events['items']) ? count($events['items']) : null;
    $out['sa_events_summaries'] = [];
    if (isset($events['items'])) {
        foreach ($events['items'] as $ev) {
            $out['sa_events_summaries'][] = [
                'start' => $ev['start']['dateTime'] ?? $ev['start']['date'] ?? '?',
                // Don't leak real summary content — just whether there IS a summary
                'has_summary' => !empty($ev['summary']),
            ];
        }
    }
    if (!isset($events['items'])) {
        $out['sa_events_error'] = $events;
    }
}

// 6. What's in appointments.json on the server right now?
$apptFile = __DIR__ . '/appointments.json';
if (file_exists($apptFile)) {
    $apptRaw  = file_get_contents($apptFile);
    $apptData = json_decode($apptRaw, true);
    $out['appointments_json_count'] = is_array($apptData) ? count($apptData) : 'invalid';
    // Don't leak PII — just dates + times
    $out['appointments_json_preview'] = [];
    if (is_array($apptData)) {
        foreach ($apptData as $a) {
            $out['appointments_json_preview'][] = [
                'date' => $a['date'] ?? '?',
                'time' => $a['time'] ?? '?',
            ];
        }
    }
} else {
    $out['appointments_json_exists'] = false;
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
