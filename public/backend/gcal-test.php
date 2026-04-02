<?php
header('Content-Type: application/json; charset=utf-8');

@include __DIR__ . '/google-config.php';

$result = [];
$result['config_loaded'] = defined('GOOGLE_REFRESH_TOKEN');

if (!defined('GOOGLE_REFRESH_TOKEN')) {
    $result['error'] = 'google-config.php not loaded';
    echo json_encode($result, JSON_PRETTY_PRINT);
    exit;
}

// Step 1: Get access token
$tokenRes = curl_init('https://oauth2.googleapis.com/token');
curl_setopt_array($tokenRes, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'client_id'     => GOOGLE_CLIENT_ID,
        'client_secret' => GOOGLE_CLIENT_SECRET,
        'refresh_token' => GOOGLE_REFRESH_TOKEN,
        'grant_type'    => 'refresh_token',
    ]),
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
    CURLOPT_TIMEOUT => 10,
]);
$tokenBody = curl_exec($tokenRes);
$tokenError = curl_error($tokenRes);
curl_close($tokenRes);

$result['token_curl_error'] = $tokenError ?: null;
$tokenData = json_decode($tokenBody, true);
$result['token_response'] = $tokenData;

$accessToken = $tokenData['access_token'] ?? null;
$result['has_access_token'] = (bool)$accessToken;

if (!$accessToken) {
    echo json_encode($result, JSON_PRETTY_PRINT);
    exit;
}

// Step 2: Try freeBusy query for April 6
$date = '2026-04-06';
$tz = 'America/Kentucky/Louisville';
$body = json_encode([
    'timeMin'  => $date . 'T00:00:00-04:00',
    'timeMax'  => $date . 'T23:59:59-04:00',
    'timeZone' => $tz,
    'items'    => [['id' => GOOGLE_CALENDAR_ID]],
]);

$fbRes = curl_init('https://www.googleapis.com/calendar/v3/freeBusy');
curl_setopt_array($fbRes, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $accessToken],
    CURLOPT_TIMEOUT => 10,
]);
$fbBody = curl_exec($fbRes);
$fbError = curl_error($fbRes);
curl_close($fbRes);

$result['freebusy_curl_error'] = $fbError ?: null;
$result['freebusy_response'] = json_decode($fbBody, true);

// Step 3: Also try listing events directly
$eventsUrl = 'https://www.googleapis.com/calendar/v3/calendars/' . urlencode(GOOGLE_CALENDAR_ID)
    . '/events?timeMin=' . urlencode($date . 'T00:00:00-04:00')
    . '&timeMax=' . urlencode($date . 'T23:59:59-04:00')
    . '&singleEvents=true&orderBy=startTime';

$evRes = curl_init($eventsUrl);
curl_setopt_array($evRes, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $accessToken],
    CURLOPT_TIMEOUT => 10,
]);
$evBody = curl_exec($evRes);
curl_close($evRes);

$result['events_response'] = json_decode($evBody, true);

echo json_encode($result, JSON_PRETTY_PRINT);
