<?php
// Reminder cron script — run daily via cron
// Usage: curl "https://notaryaplus.com/backend/recordatorio.php?token=YOUR_SECRET"
// Cron: 0 9 * * * curl -s "https://notaryaplus.com/backend/recordatorio.php?token=YOUR_SECRET" >> /tmp/recordatorio.log 2>&1

define('RECORDATORIO_SECRET', getenv('RECORDATORIO_SECRET') ?: 'notary_reminder_2025_secret');

// Token auth
$token = $_GET['token'] ?? '';
if (!hash_equals(RECORDATORIO_SECRET, $token)) {
    http_response_code(403);
    echo "403 Forbidden\n";
    exit();
}

@include __DIR__ . '/google-config.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';
require_once __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

$DATA_FILE = __DIR__ . '/appointments.json';
$SMTP_HOST = defined('SMTP_HOST') ? SMTP_HOST : '';
$SMTP_PORT = defined('SMTP_PORT') ? SMTP_PORT : 465;
$SMTP_USER = defined('SMTP_USER') ? SMTP_USER : '';
$SMTP_PASS = defined('SMTP_PASS') ? SMTP_PASS : '';

$SERVICE_LABELS = [
    'taxes_individual'  => 'Taxes Individuales',
    'taxes_negocio'     => 'Taxes de Negocio / Corporación',
    'taxes_camionero'   => 'Trámites para Camioneros (IRP/IFTA/KYU)',
    'notaria'           => 'Notaría Pública',
    'inmigracion'       => 'Inmigración / Formularios',
    'ciudadania'        => 'Clases de Ciudadanía',
    'pasaporte'         => 'Pasaporte Cubano/Americano',
    'negocios'          => 'Registro / Estructuración de Negocios',
    'itin'              => 'Número de ITIN',
    'contabilidad'      => 'Contabilidad y Nóminas',
    'traducciones'      => 'Traducciones Profesionales',
    'otro'              => 'Otro / Consulta General',
];

echo "[" . date('Y-m-d H:i:s') . "] Iniciando recordatorios...\n";

// Get tomorrow's date in Louisville timezone
$tz       = new DateTimeZone('America/Kentucky/Louisville');
$tomorrow = new DateTime('now', $tz);
$tomorrow->modify('+1 day');
$tomorrowStr = $tomorrow->format('Y-m-d');

echo "[INFO] Buscando citas para: $tomorrowStr\n";

// Read appointments
if (!file_exists($DATA_FILE)) {
    echo "[INFO] No existe appointments.json. Nada que hacer.\n";
    exit();
}
$raw  = file_get_contents($DATA_FILE);
$data = json_decode($raw, true);
if (!is_array($data)) {
    echo "[ERROR] No se pudo leer appointments.json.\n";
    exit();
}

$updated  = false;
$sent     = 0;
$skipped  = 0;

foreach ($data as &$appt) {
    if (($appt['date'] ?? '') !== $tomorrowStr) continue;

    if (!empty($appt['reminderSent'])) {
        echo "[SKIP] {$appt['id']} — recordatorio ya enviado.\n";
        $skipped++;
        continue;
    }

    $clientEmail = trim($appt['email'] ?? '');
    if (empty($clientEmail) || strpos($clientEmail, '@') === false) {
        echo "[SKIP] {$appt['id']} — sin email válido ({$appt['name']}).\n";
        $appt['reminderSent'] = true;
        $updated = true;
        $skipped++;
        continue;
    }

    $serviceLabel = $SERVICE_LABELS[$appt['service']] ?? $appt['service'];

    // Format time
    list($h, $m) = explode(':', $appt['time']);
    $h    = (int)$h;
    $p    = $h >= 12 ? 'PM' : 'AM';
    $h12  = $h % 12 === 0 ? 12 : $h % 12;
    $timeStr = "$h12:$m $p";

    // Format date
    $dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    $dateTs   = strtotime($appt['date'] . ' 12:00:00');
    $dayName  = $dayNames[date('w', $dateTs)];
    $dateStr  = $dayName . ', ' . date('d/m/Y', $dateTs);

    $subject = "Recordatorio de Cita — Mañana {$timeStr}";

    $body = "
    <div style='font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a2e;'>
      <div style='background:#1B3356;padding:24px;text-align:center;'>
        <h1 style='color:#C8A214;margin:0;font-size:22px;'>3-1 Notary A Plus</h1>
        <p style='color:#C5E8D5;margin:4px 0 0;font-size:13px;'>Business &amp; Tax Services</p>
      </div>
      <div style='padding:28px;background:#f9f9f9;border:1px solid #e0e0e0;'>
        <h2 style='color:#1B3356;margin-top:0;'>Recordatorio de tu Cita de Mañana</h2>
        <p style='color:#444;font-size:15px;'>Hola <strong>" . htmlspecialchars($appt['name']) . "</strong>, te recordamos que tienes una cita programada para <strong>mañana</strong>:</p>

        <div style='background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:20px;margin:20px 0;'>
          <table style='width:100%;border-collapse:collapse;'>
            <tr>
              <td style='padding:8px 0;color:#555;width:35%;font-size:14px;'><strong>Servicio:</strong></td>
              <td style='padding:8px 0;color:#C8A214;font-weight:bold;font-size:14px;'>" . htmlspecialchars($serviceLabel) . "</td>
            </tr>
            <tr>
              <td style='padding:8px 0;color:#555;font-size:14px;'><strong>Fecha:</strong></td>
              <td style='padding:8px 0;font-weight:bold;font-size:14px;'>" . htmlspecialchars($dateStr) . "</td>
            </tr>
            <tr>
              <td style='padding:8px 0;color:#555;font-size:14px;'><strong>Hora:</strong></td>
              <td style='padding:8px 0;font-weight:bold;font-size:14px;color:#1B3356;'>" . htmlspecialchars($timeStr) . "</td>
            </tr>
          </table>
        </div>

        <div style='background:#EAF7EF;border-left:4px solid #C8A214;border-radius:4px;padding:14px;margin-bottom:20px;'>
          <p style='margin:0;font-size:13px;color:#1B3356;'>
            <strong>Dirección:</strong> 8514 Preston Hwy, Louisville, KY 40219<br>
            <strong>ID de Cita:</strong> " . htmlspecialchars($appt['id']) . "
          </p>
        </div>

        <p style='font-size:14px;color:#444;border-top:1px solid #eee;padding-top:16px;'>
          Si no puedes asistir, por favor llámanos al <strong style='color:#1B3356;'>(502) 654-7076</strong> con anticipación para reagendar tu cita.
        </p>
      </div>
      <div style='background:#1B3356;padding:16px;text-align:center;'>
        <p style='color:#C5E8D5;margin:0;font-size:12px;'>8514 Preston Hwy, Louisville, KY 40219 | (502) 654-7076</p>
        <p style='color:#8faac0;margin:4px 0 0;font-size:11px;'>&copy; " . date('Y') . " 3-1 Notary A Plus — Myrna Rodríguez</p>
      </div>
    </div>";

    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = $SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = $SMTP_USER;
        $mail->Password   = $SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = $SMTP_PORT;
        $mail->CharSet    = 'UTF-8';
        $mail->isHTML(true);
        $mail->setFrom($SMTP_USER, '3-1 Notary A Plus');
        $mail->addReplyTo('notaryaplus31@gmail.com', '3-1 Notary A Plus');
        $mail->addAddress($clientEmail, $appt['name']);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->send();

        $appt['reminderSent'] = true;
        $updated = true;
        $sent++;
        echo "[OK] Recordatorio enviado a {$clientEmail} ({$appt['name']}) — {$appt['id']}\n";
    } catch (PHPMailerException $e) {
        echo "[ERROR] Fallo al enviar a {$clientEmail}: " . $e->getMessage() . "\n";
    }
}
unset($appt);

// Save updated appointments
if ($updated) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    $tmp  = $DATA_FILE . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) !== false) {
        rename($tmp, $DATA_FILE);
        echo "[INFO] appointments.json actualizado.\n";
    } else {
        echo "[ERROR] No se pudo escribir appointments.json.\n";
    }
}

echo "[DONE] Enviados: $sent | Omitidos: $skipped\n";
