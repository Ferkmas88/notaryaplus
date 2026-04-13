<?php
// TEMPORARY DIAGNOSTIC — checks each calendar the Service Account is
// supposed to read, one by one. Token-protected, delete after use.

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

// Same list the web uses (hardcoded here so this file is self-contained)
$calendars = [
    'notaryaplus31@gmail.com',
    '2025e3f6e24a55cee2d0d08205baa9d571bbe0a93aa72157115fef122af071a4@group.calendar.google.com',
    'ale.notaryaplus@gmail.com',
    'cecilia1.notaryaplus@gmail.com',
    'danae.notaryaplus@gmail.com',
];

// Probe a 14-day window starting today (Louisville tz)
$tz = new DateTimeZone('America/Kentucky/Louisville');
$dtMin = new DateTime('now', $tz);
$dtMin->setTime(0, 0, 0);
$dtMax = (clone $dtMin)->modify('+14 days');
$dtMax->setTime(23, 59, 59);
$timeMin = $dtMin->format(DateTime::RFC3339);
$timeMax = $dtMax->format(DateTime::RFC3339);

$out['window'] = [
    'from' => $timeMin,
    'to'   => $timeMax,
];

$out['calendars'] = [];
foreach ($calendars as $cid) {
    $probe = ['id' => $cid];

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

    $d = json_decode($res, true);

    if ($code === 200 && isset($d['items'])) {
        $probe['status']       = 'ok';
        $probe['http']         = 200;
        $probe['events_count'] = count($d['items']);
        // Show the first 3 event start times — no titles, no PII
        $probe['first_events'] = [];
        $n = 0;
        foreach ($d['items'] as $ev) {
            $probe['first_events'][] = $ev['start']['dateTime'] ?? $ev['start']['date'] ?? '?';
            if (++$n >= 3) break;
        }
    } else {
        $probe['status']      = 'error';
        $probe['http']        = $code;
        $probe['error']       = $d['error']['message'] ?? ('HTTP ' . $code);
    }

    $out['calendars'][] = $probe;
}

// Totals
$out['summary'] = [
    'reachable'   => count(array_filter($out['calendars'], fn($c) => ($c['status'] ?? '') === 'ok')),
    'unreachable' => count(array_filter($out['calendars'], fn($c) => ($c['status'] ?? '') !== 'ok')),
    'total'       => count($out['calendars']),
];

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
