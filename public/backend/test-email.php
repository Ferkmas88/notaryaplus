<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';
require_once __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

$results = [];
$results['time'] = date('c');
$results['method'] = 'SMTP (PHPMailer)';

$emails = [
    'notaryaplus31@gmail.com',
    'notaryaplus3_1@yahoo.com',
];

$results['emails'] = [];

foreach ($emails as $to) {
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'citas@notaryaplus.com';
        $mail->Password   = 'Hhb~at1LR^z3';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->CharSet    = 'UTF-8';
        $mail->isHTML(true);
        $mail->setFrom('citas@notaryaplus.com', '3-1 Notary A Plus');
        $mail->addAddress($to);
        $mail->Subject = 'TEST SMTP Notary - ' . date('H:i:s');
        $mail->Body    = '<h2>Email de prueba via SMTP</h2><p>Si ves esto, el correo funciona correctamente.</p><p>Enviado: ' . date('c') . '</p>';
        $mail->send();
        $results['emails'][] = ['to' => $to, 'sent' => true, 'error' => null];
    } catch (PHPMailerException $e) {
        $results['emails'][] = ['to' => $to, 'sent' => false, 'error' => $e->getMessage()];
    }
}

echo json_encode($results, JSON_PRETTY_PRINT);
