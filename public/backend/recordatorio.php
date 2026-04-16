<?php
// Reminder cron — reads events directly from Google Calendar across all notary calendars.
// Replaces the previous appointments.json-based reader so reminders also fire for
// events that Myrna / secretaries create by hand in their own calendars.
// Cron: 0 9 * * * curl -s "https://notaryaplus.com/backend/recordatorio.php?token=YOUR_SECRET"

define('RECORDATORIO_SECRET', getenv('RECORDATORIO_SECRET') ?: 'notary_reminder_2025_secret');

$token = $_GET['token'] ?? '';
if (!hash_equals(RECORDATORIO_SECRET, $token)) {
    http_response_code(403);
    echo "403 Forbidden\n";
    exit();
}

@include __DIR__ . '/google-config.php';
require_once __DIR__ . '/gcal-auth.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';
require_once __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

// Keep in sync with NOTARY_READ_CALENDAR_IDS in citas.php — update both if adding a calendar
const REMINDER_READ_CALENDARS = [
    'notaryaplus31@gmail.com',
    '2025e3f6e24a55cee2d0d08205baa9d571bbe0a93aa72157115fef122af071a4@group.calendar.google.com',
    'ale.notaryaplus@gmail.com',
    'cecilia1.notaryaplus@gmail.com',
    'danae.notaryaplus@gmail.com',
];

const SA_EMAIL = 'notaryaplus-calendar@notaryaplus-backend.iam.gserviceaccount.com';

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

$APPT_LOG_FILE = __DIR__ . '/appointments.json';
$REMINDER_LOG  = __DIR__ . '/reminder_sent_log.json';

$SMTP_HOST = defined('SMTP_HOST') ? SMTP_HOST : '';
$SMTP_PORT = defined('SMTP_PORT') ? SMTP_PORT : 465;
$SMTP_USER = defined('SMTP_USER') ? SMTP_USER : '';
$SMTP_PASS = defined('SMTP_PASS') ? SMTP_PASS : '';

echo "[" . date('Y-m-d H:i:s') . "] Iniciando recordatorios...\n";

// Tomorrow in Louisville TZ
$tz       = new DateTimeZone('America/Kentucky/Louisville');
$tomorrow = new DateTime('now', $tz);
$tomorrow->modify('+1 day');
$tomorrowStr = $tomorrow->format('Y-m-d');

$dayStart = (new DateTime($tomorrowStr . ' 00:00:00', $tz))->format(DateTime::RFC3339);
$dayEnd   = (new DateTime($tomorrowStr . ' 23:59:59', $tz))->format(DateTime::RFC3339);

echo "[INFO] Buscando citas para: $tomorrowStr\n";

// Obtain Service Account token
$saToken = gcalServiceAccountToken('https://www.googleapis.com/auth/calendar');
if (!$saToken) {
    echo "[ERROR] No se pudo obtener token del Service Account. Abortando.\n";
    exit(1);
}

// Load reminder log (event IDs already notified) to avoid duplicates across runs
$reminderLog = [];
if (file_exists($REMINDER_LOG)) {
    $raw = file_get_contents($REMINDER_LOG);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) $reminderLog = $decoded;
}

// Index appointments.json by ID for fallback email/name lookup (web-booked entries)
$apptsById = [];
if (file_exists($APPT_LOG_FILE)) {
    $appts = json_decode(file_get_contents($APPT_LOG_FILE), true);
    if (is_array($appts)) {
        foreach ($appts as $a) {
            if (!empty($a['id'])) $apptsById[$a['id']] = $a;
        }
    }
}

function gcalListEventsForDay($calId, $timeMin, $timeMax, $token) {
    $qs = http_build_query([
        'timeMin'      => $timeMin,
        'timeMax'      => $timeMax,
        'singleEvents' => 'true',
        'orderBy'      => 'startTime',
        'maxResults'   => 50,
    ]);
    $url = 'https://www.googleapis.com/calendar/v3/calendars/' . urlencode($calId) . '/events?' . $qs;
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer $token"],
        CURLOPT_TIMEOUT        => 20,
    ]);
    $res  = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200) {
        error_log("[recordatorio] events.list $calId http=$http body=" . substr((string)$res, 0, 200));
        echo "[WARN] events.list $calId fallo http=$http\n";
        return [];
    }
    $data = json_decode($res, true);
    return $data['items'] ?? [];
}

function extractEmailFromText($text) {
    if (!$text) return '';
    if (preg_match('/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/', $text, $m)) return $m[0];
    return '';
}

function extractApptIdFromText($text) {
    if (!$text) return '';
    if (preg_match('/ID:\s*([A-Za-z0-9_\-]+)/', $text, $m)) return $m[1];
    return '';
}

$sent    = 0;
$skipped = 0;
$errors  = 0;
$seenIds = [];

foreach (REMINDER_READ_CALENDARS as $calId) {
    echo "[CAL] Leyendo $calId...\n";
    $events = gcalListEventsForDay($calId, $dayStart, $dayEnd, $saToken);
    echo "[CAL] $calId -> " . count($events) . " eventos\n";

    foreach ($events as $ev) {
        $evId = $ev['id'] ?? '';
        if (!$evId) continue;
        if (($ev['status'] ?? '') === 'cancelled') continue;

        // Dedupe across calendars (the same attendee-linked event can show on multiple)
        if (isset($seenIds[$evId])) continue;
        $seenIds[$evId] = true;

        if (!empty($reminderLog[$evId])) {
            echo "[SKIP] $evId — recordatorio ya enviado el {$reminderLog[$evId]}\n";
            $skipped++;
            continue;
        }

        $summary = $ev['summary'] ?? '';
        $desc    = $ev['description'] ?? '';

        $clientEmail = '';
        $clientName  = '';
        foreach ($ev['attendees'] ?? [] as $att) {
            $em = $att['email'] ?? '';
            if ($em && $em !== SA_EMAIL && strpos($em, '@') !== false) {
                $clientEmail = $em;
                $clientName  = $att['displayName'] ?? '';
                break;
            }
        }
        if (!$clientEmail) {
            $clientEmail = extractEmailFromText($desc);
        }

        $serviceKey = '';
        $apptId     = extractApptIdFromText($desc);
        if ($apptId && isset($apptsById[$apptId])) {
            $a = $apptsById[$apptId];
            if (!$clientEmail) $clientEmail = trim($a['email'] ?? '');
            if (!$clientName)  $clientName  = $a['name'] ?? '';
            $serviceKey = $a['service'] ?? '';
        }
        if (!$clientName) $clientName = 'Cliente';

        if (!$clientEmail || strpos($clientEmail, '@') === false) {
            echo "[SKIP] $evId — sin email (summary='$summary')\n";
            $skipped++;
            continue;
        }

        $startRaw = $ev['start']['dateTime'] ?? $ev['start']['date'] ?? '';
        if (!$startRaw) continue;
        try {
            $dt = new DateTime($startRaw);
        } catch (Exception $e) {
            continue;
        }
        $dt->setTimezone($tz);
        $h   = (int)$dt->format('H');
        $min = $dt->format('i');
        $p   = $h >= 12 ? 'PM' : 'AM';
        $h12 = $h % 12 === 0 ? 12 : $h % 12;
        $timeStr = "$h12:$min $p";

        $dayNames = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        $dayName  = $dayNames[(int)$dt->format('w')];
        $dateStr  = $dayName . ', ' . $dt->format('d/m/Y');

        $serviceLabel = '';
        if (strpos($summary, '—') !== false) {
            $parts = explode('—', $summary, 2);
            $serviceLabel = trim($parts[1]);
        }
        if (!$serviceLabel && $serviceKey && isset($SERVICE_LABELS[$serviceKey])) {
            $serviceLabel = $SERVICE_LABELS[$serviceKey];
        }
        if (!$serviceLabel) $serviceLabel = $summary ?: 'Consulta General';

        $subject = "Recordatorio de Cita — Mañana {$timeStr}";

        $body = "
        <div style='font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a2e;'>
          <div style='background:#1B3356;padding:24px;text-align:center;'>
            <h1 style='color:#C8A214;margin:0;font-size:22px;'>3-1 Notary A Plus</h1>
            <p style='color:#C5E8D5;margin:4px 0 0;font-size:13px;'>Business &amp; Tax Services</p>
          </div>
          <div style='padding:28px;background:#f9f9f9;border:1px solid #e0e0e0;'>
            <h2 style='color:#1B3356;margin-top:0;'>Recordatorio de tu Cita de Mañana</h2>
            <p style='color:#444;font-size:15px;'>Hola <strong>" . htmlspecialchars($clientName) . "</strong>, te recordamos que tienes una cita programada para <strong>mañana</strong>:</p>

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
                <strong>Dirección:</strong> 8514 Preston Hwy, Louisville, KY 40219
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
            $mail->addAddress($clientEmail, $clientName);
            $mail->Subject = $subject;
            $mail->Body    = $body;
            $mail->send();

            $reminderLog[$evId] = date('Y-m-d H:i:s');
            $sent++;
            echo "[OK] Recordatorio enviado a $clientEmail ($clientName) — $evId\n";
        } catch (PHPMailerException $e) {
            echo "[ERROR] Fallo al enviar a $clientEmail: " . $e->getMessage() . "\n";
            $errors++;
        }
    }
}

// Prune log entries older than 7 days to keep the file small
$cutoff = time() - 7 * 86400;
foreach ($reminderLog as $eid => $ts) {
    if (strtotime($ts) < $cutoff) unset($reminderLog[$eid]);
}

$json = json_encode($reminderLog, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
$tmp  = $REMINDER_LOG . '.tmp';
if (file_put_contents($tmp, $json, LOCK_EX) !== false) {
    rename($tmp, $REMINDER_LOG);
} else {
    echo "[WARN] No se pudo escribir reminder_sent_log.json\n";
}

echo "[DONE] Enviados: $sent | Omitidos: $skipped | Errores: $errors\n";
