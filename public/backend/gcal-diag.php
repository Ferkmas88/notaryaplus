<?php
// TEMP diag — one-shot check of all calendars the SA reads.
header('Content-Type: application/json; charset=utf-8');

if (($_GET['t'] ?? '') !== 'diag-2026-04-13-notary') {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit;
}

@include __DIR__ . '/google-config.php';
require_once __DIR__ . '/gcal-auth.php';

$saToken = gcalServiceAccountToken('https://www.googleapis.com/auth/calendar');
if (!$saToken) {
    echo json_encode(['error' => 'no token']);
    exit;
}

$calendars = [
    'notaryaplus31@gmail.com',
    '2025e3f6e24a55cee2d0d08205baa9d571bbe0a93aa72157115fef122af071a4@group.calendar.google.com',
    'ale.notaryaplus@gmail.com',
    'cecilia1.notaryaplus@gmail.com',
    'danae.notaryaplus@gmail.com',
];

$tz = new DateTimeZone('America/Kentucky/Louisville');
$dtMin = new DateTime('now', $tz);
$dtMin->setTime(0, 0, 0);
$dtMax = (clone $dtMin)->modify('+14 days');
$dtMax->setTime(23, 59, 59);
$timeMin = $dtMin->format(DateTime::RFC3339);
$timeMax = $dtMax->format(DateTime::RFC3339);

$out = ['calendars' => []];
foreach ($calendars as $cid) {
    $url = 'https://www.googleapis.com/calendar/v3/calendars/' . urlencode($cid) . '/events'
        . '?timeMin=' . urlencode($timeMin)
        . '&timeMax=' . urlencode($timeMax)
        . '&singleEvents=true&maxResults=50';
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
    $out['calendars'][] = [
        'id'           => $cid,
        'http'         => $code,
        'ok'           => $code === 200 && isset($d['items']),
        'events_count' => isset($d['items']) ? count($d['items']) : 0,
        'error'        => $code !== 200 ? ($d['error']['message'] ?? 'unknown') : null,
    ];
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
