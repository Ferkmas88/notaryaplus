<?php
header('Content-Type: application/json; charset=utf-8');

$results = [];
$results['php_version'] = phpversion();
$results['server'] = $_SERVER['SERVER_NAME'] ?? 'unknown';
$results['sendmail_path'] = ini_get('sendmail_path') ?: 'not set';
$results['time'] = date('c');

$serverDomain = $_SERVER['SERVER_NAME'] ?? 'notaryaplus.com';
$from = 'citas@' . $serverDomain;
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: 3-1 Notary A Plus <{$from}>\r\n";
$headers .= "Reply-To: notaryaplus26@gmail.com\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$subject = 'TEST Notary A Plus - ' . date('H:i:s');
$body = '<h2>Email de prueba</h2><p>Si ves esto, el correo funciona desde Hostinger.</p><p>Enviado: ' . date('c') . '</p>';

$emails = [
    'notaryaplus26@gmail.com',
    'notaryaplus3_1@yahoo.com',
    'ferkmas88@gmail.com',
];

$results['from'] = $from;
$results['emails'] = [];

foreach ($emails as $to) {
    $sent = mail($to, $subject, $body, $headers, '-f ' . $from);
    $results['emails'][] = [
        'to' => $to,
        'sent' => $sent,
        'error' => $sent ? null : error_get_last(),
    ];
}

echo json_encode($results, JSON_PRETTY_PRINT);
