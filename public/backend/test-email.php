<?php
header('Content-Type: application/json; charset=utf-8');

$results = [];

// 1. Verificar que mail() existe
$results['mail_function_exists'] = function_exists('mail');

// 2. Verificar servidor de correo
$results['php_version'] = phpversion();
$results['server'] = $_SERVER['SERVER_NAME'] ?? 'unknown';
$results['sendmail_path'] = ini_get('sendmail_path') ?: 'not set';
$results['smtp'] = ini_get('SMTP') ?: 'not set';
$results['smtp_port'] = ini_get('smtp_port') ?: 'not set';

// 3. Intentar enviar email de prueba
$to = 'ferkmas88@gmail.com';
$subject = 'TEST Notary A Plus - ' . date('Y-m-d H:i:s');
$body = '<h2>Email de prueba</h2><p>Si ves esto, mail() funciona en Hostinger.</p><p>Hora: ' . date('c') . '</p>';
$serverDomain = $_SERVER['SERVER_NAME'] ?? 'notaryaplus.com';
$from = 'citas@' . $serverDomain;
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Notary Test <{$from}>\r\n";
$headers .= "Reply-To: notaryaplus26@gmail.com\r\n";

$sent = mail($to, $subject, $body, $headers, '-f ' . $from);
$results['mail_sent'] = $sent;
$results['mail_to'] = $to;
$results['mail_from'] = $from;
$results['error'] = error_get_last();

echo json_encode($results, JSON_PRETTY_PRINT);
