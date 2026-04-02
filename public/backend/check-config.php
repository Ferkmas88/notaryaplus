<?php
header('Content-Type: application/json; charset=utf-8');

$result = [];
$result['google_config_exists'] = file_exists(__DIR__ . '/google-config.php');

@include __DIR__ . '/google-config.php';

$result['GOOGLE_CLIENT_ID'] = defined('GOOGLE_CLIENT_ID') ? 'SET (' . substr(GOOGLE_CLIENT_ID, 0, 10) . '...)' : 'NOT SET';
$result['GOOGLE_CLIENT_SECRET'] = defined('GOOGLE_CLIENT_SECRET') ? 'SET' : 'NOT SET';
$result['GOOGLE_REFRESH_TOKEN'] = defined('GOOGLE_REFRESH_TOKEN') ? 'SET' : 'NOT SET';
$result['GOOGLE_CALENDAR_ID'] = defined('GOOGLE_CALENDAR_ID') ? GOOGLE_CALENDAR_ID : 'NOT SET';

echo json_encode($result, JSON_PRETTY_PRINT);
