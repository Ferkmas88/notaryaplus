<?php
header('Access-Control-Allow-Origin: https://notaryaplus.com');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

@include __DIR__ . '/google-config.php';
require_once __DIR__ . '/gcal-auth.php';

// Calendar Myrna herself uses — this is where NEW web bookings get created.
const NOTARY_CALENDAR_ID = 'notaryaplus31@gmail.com';

// All calendars the public slot check reads (Myrna + her secretaries).
// Any of these with an event in a given slot blocks that slot on the web.
// Each calendar must be shared with the Service Account
// (notaryaplus-calendar@notaryaplus-backend.iam.gserviceaccount.com) with
// at least "See all event details". To add a new secretary calendar,
// append its ID here and share it.
const NOTARY_READ_CALENDAR_IDS = [
    'notaryaplus31@gmail.com',                                                                     // Myrna (primary)
    '2025e3f6e24a55cee2d0d08205baa9d571bbe0a93aa72157115fef122af071a4@group.calendar.google.com', // "Negocios" (Myrna's blue secondary calendar, shared with the whole office)
    'ale.notaryaplus@gmail.com',                                                                   // Ale
    'cecilia1.notaryaplus@gmail.com',                                                              // Cecilia
    'danae.notaryaplus@gmail.com',                                                                 // Danae
    // Each calendar ABOVE must be shared with the Service Account
    // notaryaplus-calendar@notaryaplus-backend.iam.gserviceaccount.com
    // with "See all event details" (or higher). Otherwise freeBusy returns
    // an error for that calendar and it is silently skipped (logged).
];
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';
require_once __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

$DATA_FILE      = __DIR__ . '/appointments.json';
$CONTACT_EMAIL  = 'notaryaplus31@gmail.com';
$CONTACT_EMAIL2 = 'notaryaplus3_1@yahoo.com';
$CONTACT_EMAIL3 = 'cecilia1notaryaplus@gmail.com';

// SMTP config — loaded from gitignored google-config.php
$SMTP_HOST = defined('SMTP_HOST') ? SMTP_HOST : '';
$SMTP_PORT = defined('SMTP_PORT') ? SMTP_PORT : 465;
$SMTP_USER = defined('SMTP_USER') ? SMTP_USER : '';
$SMTP_PASS = defined('SMTP_PASS') ? SMTP_PASS : '';

$BUSINESS_HOURS = [
    1 => ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"],
    2 => ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"],
    3 => ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"],
    4 => ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"],
    5 => ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"],
    6 => ["10:00","11:00","12:00","13:00","14:00","15:00","16:00"],
    0 => [],
];

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

$DAY_NAMES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

// ─── Google Calendar helpers ──────────────────────────────────────────────────

function curlPost($url, $headers, $body) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $res = curl_exec($ch);
    curl_close($ch);
    return $res ?: null;
}

function gcalAccessTokenOAuth($refreshToken = null) {
    // Legacy OAuth fallback — used only if the Service Account JSON is not
    // present on the server yet. Expires every 7 days in Testing mode, which
    // is exactly the bug we want to eliminate. Kept temporarily so the site
    // does not break during the transition window before service-account.json
    // is uploaded to Hostinger.
    $rt = $refreshToken ?: (defined('GOOGLE_REFRESH_TOKEN') ? GOOGLE_REFRESH_TOKEN : null);
    if (!$rt || !defined('GOOGLE_CLIENT_ID') || !defined('GOOGLE_CLIENT_SECRET')) return null;
    $res = curlPost(
        'https://oauth2.googleapis.com/token',
        ['Content-Type: application/x-www-form-urlencoded'],
        http_build_query([
            'client_id'     => GOOGLE_CLIENT_ID,
            'client_secret' => GOOGLE_CLIENT_SECRET,
            'refresh_token' => $rt,
            'grant_type'    => 'refresh_token',
        ])
    );
    if (!$res) return null;
    $data = json_decode($res, true);
    return $data['access_token'] ?? null;
}

function gcalAccessToken($legacyRefreshToken = null) {
    // Prefer Service Account (never expires). Fall back to legacy OAuth
    // only if service-account.json is not yet deployed. This guarantees the
    // site keeps working during the transition window.
    // Scope: full "calendar" — required for freeBusy.query. The narrower
    // "calendar.events" scope returns 403 on freeBusy.
    $token = gcalServiceAccountToken('https://www.googleapis.com/auth/calendar');
    if ($token) return $token;
    return gcalAccessTokenOAuth($legacyRefreshToken);
}

function gcalBusySlots($date, $token) {
    if (!$token) return [];

    // Union of busy periods across every calendar we read (Myrna + secretaries).
    // A single freeBusy.query can list up to 50 calendars at once — cheap.
    $items = [];
    foreach (NOTARY_READ_CALENDAR_IDS as $cid) {
        $items[] = ['id' => $cid];
    }

    $tz     = new DateTimeZone('America/Kentucky/Louisville');
    $dtMin  = new DateTime($date . ' 00:00:00', $tz);
    $dtMax  = new DateTime($date . ' 23:59:59', $tz);
    $body = json_encode([
        'timeMin'  => $dtMin->format(DateTime::RFC3339),
        'timeMax'  => $dtMax->format(DateTime::RFC3339),
        'timeZone' => 'America/Kentucky/Louisville',
        'items'    => $items,
    ]);
    $res = curlPost(
        'https://www.googleapis.com/calendar/v3/freeBusy',
        ['Content-Type: application/json', "Authorization: Bearer $token"],
        $body
    );
    if (!$res) return [];
    $data = json_decode($res, true);

    // Collect busy periods from every calendar that responded without error.
    // A calendar with an error (not shared with SA, wrong ID, etc.) is logged
    // and skipped so one misconfigured entry does not nuke the whole check.
    $periods = [];
    foreach (NOTARY_READ_CALENDAR_IDS as $cid) {
        $calResp = $data['calendars'][$cid] ?? null;
        if (!$calResp) continue;
        if (!empty($calResp['errors'])) {
            error_log('[freeBusy] ' . $cid . ' error: ' . json_encode($calResp['errors']));
            continue;
        }
        foreach ($calResp['busy'] ?? [] as $p) {
            $periods[] = $p;
        }
    }

    $busySlots = [];
    $localTz   = new DateTimeZone('America/Kentucky/Louisville');
    foreach ($periods as $period) {
        $start = strtotime($period['start']);
        $end   = strtotime($period['end']);
        for ($h = 10; $h <= 17; $h++) {
            $slotDt    = new DateTime($date . sprintf(' %02d:00:00', $h), $localTz);
            $slotStart = $slotDt->getTimestamp();
            $slotEnd   = $slotStart + 3600;
            if ($start < $slotEnd && $end > $slotStart) {
                $busySlots[] = sprintf('%02d:00', $h);
            }
        }
    }
    return array_values(array_unique($busySlots));
}

function gcalCreateEvent($appt, $token, $serviceLabels, $calendarId = null, $colorId = null) {
    if (!$token) return;
    $calId   = $calendarId ?: NOTARY_CALENDAR_ID;
    if (!$calId) return;
    $label   = $serviceLabels[$appt['service']] ?? $appt['service'];
    $endHour = sprintf('%02d', (int)substr($appt['time'], 0, 2) + 1);
    $endMin  = substr($appt['time'], 3, 2);
    $desc    = "ID: {$appt['id']}";
    if (!empty($appt['createdBy'])) {
        $desc .= "\nCreado por: {$appt['createdBy']}";
    }
    $event   = [
        'summary'     => "Cita Reservada — {$label}",
        'description' => $desc,
        'start' => ['dateTime' => $appt['date'] . 'T' . $appt['time'] . ':00', 'timeZone' => 'America/Kentucky/Louisville'],
        'end'   => ['dateTime' => $appt['date'] . 'T' . $endHour . ':' . $endMin . ':00', 'timeZone' => 'America/Kentucky/Louisville'],
        'reminders' => [
            'useDefault' => false,
            'overrides'  => [
                ['method' => 'email', 'minutes' => 1440],
                ['method' => 'popup', 'minutes' => 60],
            ],
        ],
    ];
    if ($colorId) {
        $event['colorId'] = (string)$colorId;
    }
    $url = 'https://www.googleapis.com/calendar/v3/calendars/' . urlencode($calId) . '/events';
    curlPost($url, ['Content-Type: application/json', "Authorization: Bearer $token"], json_encode($event));
}

// ─── File helpers ─────────────────────────────────────────────────────────────

function readAppointments($file) {
    if (!file_exists($file)) return [];
    $raw = file_get_contents($file);
    if ($raw === false || trim($raw) === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function writeAppointments($file, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($json === false) return false;
    // Escribir a archivo temporal primero para evitar corrupción
    $tmp = $file . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) return false;
    return rename($tmp, $file);
}

function formatTime12h($time24) {
    list($h, $m) = explode(':', $time24);
    $h      = (int)$h;
    $period = $h >= 12 ? 'PM' : 'AM';
    $h12    = $h % 12 === 0 ? 12 : $h % 12;
    return "$h12:$m $period";
}

function createMailer() {
    global $SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS;
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
    return $mail;
}

function sendEmails($appt, $contactEmail, $contactEmail2, $contactEmail3, $serviceLabels, $dayNames) {
    $serviceLabel = $serviceLabels[$appt['service']] ?? $appt['service'];
    $dateObj  = strtotime($appt['date'] . ' 12:00:00');
    $dayName  = $dayNames[date('w', $dateObj)];
    $dateStr  = $dayName . ', ' . date('F j, Y', $dateObj);
    $timeStr  = formatTime12h($appt['time']);

    $subject = "Nueva Cita: {$serviceLabel} — {$dateStr} {$timeStr}";
    $body = "
    <div style='font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a2e;'>
      <div style='background:#1B3356;padding:24px;text-align:center;'>
        <h1 style='color:#C8A214;margin:0;font-size:22px;'>3-1 Notary A Plus</h1>
        <p style='color:#C5E8D5;margin:4px 0 0;font-size:13px;'>Business &amp; Tax Services</p>
      </div>
      <div style='padding:24px;background:#f9f9f9;border:1px solid #e0e0e0;'>
        <h2 style='color:#1B3356;margin-top:0;'>Nueva Cita Agendada</h2>
        <table style='width:100%;border-collapse:collapse;'>
          <tr><td style='padding:8px 0;color:#555;width:35%;'><strong>Cliente:</strong></td><td style='padding:8px 0;'>{$appt['name']}</td></tr>
          <tr><td style='padding:8px 0;color:#555;'><strong>Teléfono:</strong></td><td style='padding:8px 0;'>{$appt['phone']}</td></tr>
          <tr><td style='padding:8px 0;color:#555;'><strong>Email:</strong></td><td style='padding:8px 0;'>{$appt['email']}</td></tr>
          <tr><td style='padding:8px 0;color:#555;'><strong>Servicio:</strong></td><td style='padding:8px 0;color:#C8A214;font-weight:bold;'>{$serviceLabel}</td></tr>
          <tr><td style='padding:8px 0;color:#555;'><strong>Fecha:</strong></td><td style='padding:8px 0;font-weight:bold;'>{$dateStr}</td></tr>
          <tr><td style='padding:8px 0;color:#555;'><strong>Hora:</strong></td><td style='padding:8px 0;font-weight:bold;'>{$timeStr}</td></tr>
          " . ($appt['notes'] ? "<tr><td style='padding:8px 0;color:#555;vertical-align:top;'><strong>Notas:</strong></td><td style='padding:8px 0;'>{$appt['notes']}</td></tr>" : "") . "
          " . (!empty($appt['createdBy']) ? "<tr><td style='padding:8px 0;color:#555;'><strong>Creado por:</strong></td><td style='padding:8px 0;'>{$appt['createdBy']}</td></tr>" : "") . "
        </table>
        <div style='margin-top:16px;padding:12px;background:#EAF7EF;border-left:4px solid #C8A214;border-radius:4px;'>
          <p style='margin:0;font-size:13px;color:#1B3356;'>ID de Cita: <strong>{$appt['id']}</strong></p>
        </div>
        <div style='margin-top:20px;text-align:center;'>
          <a href='https://calendar.google.com/calendar/render?action=TEMPLATE&text=" . urlencode($serviceLabel . " — " . $appt['name']) . "&dates=" . str_replace('-', '', $appt['date']) . "T" . str_replace(':', '', $appt['time']) . "00/" . str_replace('-', '', $appt['date']) . "T" . sprintf('%02d', (int)substr($appt['time'], 0, 2) + 1) . substr($appt['time'], 2) . "00&details=" . urlencode("Cliente: " . $appt['name'] . "\nTeléfono: " . $appt['phone'] . "\nEmail: " . $appt['email'] . "\nServicio: " . $serviceLabel . "\nNotas: " . $appt['notes'] . "\nID: " . $appt['id']) . "&location=" . urlencode("8514 Preston Hwy, Louisville, KY 40219") . "&ctz=America/Kentucky/Louisville' target='_blank' style='display:inline-block;background:#C8A214;color:#fff;padding:14px 30px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:16px;'>AGREGAR AL CALENDARIO</a>
        </div>
      </div>
      <div style='background:#1B3356;padding:16px;text-align:center;'>
        <p style='color:#C5E8D5;margin:0;font-size:12px;'>8514 Preston Hwy, Louisville, KY 40219 | (502) 654-7076</p>
      </div>
    </div>";

    try {
        $mail = createMailer();
        $mail->addAddress($contactEmail);
        $mail->addAddress($contactEmail2);
        $mail->addAddress($contactEmail3);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->send();
    } catch (PHPMailerException $e) {
        error_log("NOTARY SMTP ERROR (negocio): " . $e->getMessage());
    }

    if (!empty($appt['email']) && strpos($appt['email'], '@') !== false) {
        $clientSubject = "Confirmación de Cita — {$dateStr} {$timeStr}";
        $clientBody = "
        <div style='font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a2e;'>
          <div style='background:#1B3356;padding:24px;text-align:center;'>
            <h1 style='color:#C8A214;margin:0;font-size:22px;'>3-1 Notary A Plus</h1>
            <p style='color:#C5E8D5;margin:4px 0 0;font-size:13px;'>Business &amp; Tax Services</p>
          </div>
          <div style='padding:24px;background:#f9f9f9;border:1px solid #e0e0e0;'>
            <h2 style='color:#1B3356;margin-top:0;'>¡Tu cita ha sido confirmada!</h2>
            <p>Hola <strong>{$appt['name']}</strong>, tu cita fue agendada exitosamente.</p>
            <table style='width:100%;border-collapse:collapse;'>
              <tr><td style='padding:8px 0;color:#555;width:35%;'><strong>Servicio:</strong></td><td style='padding:8px 0;color:#C8A214;font-weight:bold;'>{$serviceLabel}</td></tr>
              <tr><td style='padding:8px 0;color:#555;'><strong>Fecha:</strong></td><td style='padding:8px 0;font-weight:bold;'>{$dateStr}</td></tr>
              <tr><td style='padding:8px 0;color:#555;'><strong>Hora:</strong></td><td style='padding:8px 0;font-weight:bold;'>{$timeStr}</td></tr>
            </table>
            <div style='margin-top:20px;padding:16px;background:#EAF7EF;border-radius:8px;'>
              <p style='margin:4px 0;font-size:13px;'><strong>Dirección:</strong> 8514 Preston Hwy, Louisville, KY 40219</p>
              <p style='margin:4px 0;font-size:13px;'><strong>Teléfono:</strong> (502) 654-7076 / (502) 644-1312</p>
              <p style='margin:4px 0;font-size:13px;'><strong>Email:</strong> notaryaplus31@gmail.com</p>
            </div>
            <p style='margin-top:16px;font-size:13px;color:#666;'>Si necesitas cancelar o reprogramar, llámanos con al menos 24 horas de anticipación.</p>
            <div style='margin-top:20px;text-align:center;'>
              <a href='https://calendar.google.com/calendar/render?action=TEMPLATE&text=" . urlencode($serviceLabel . " — 3-1 Notary A Plus") . "&dates=" . str_replace('-', '', $appt['date']) . "T" . str_replace(':', '', $appt['time']) . "00/" . str_replace('-', '', $appt['date']) . "T" . sprintf('%02d', (int)substr($appt['time'], 0, 2) + 1) . substr($appt['time'], 2) . "00&details=" . urlencode("Cita en 3-1 Notary A Plus\nServicio: " . $serviceLabel . "\nID: " . $appt['id'] . "\nTeléfono: (502) 654-7076") . "&location=" . urlencode("8514 Preston Hwy, Louisville, KY 40219") . "&ctz=America/Kentucky/Louisville' target='_blank' style='display:inline-block;background:#C8A214;color:#fff;padding:12px 24px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:14px;'>Agregar al Calendario</a>
            </div>
          </div>
          <div style='background:#1B3356;padding:16px;text-align:center;'>
            <p style='color:#C5E8D5;margin:0;font-size:12px;'>&copy; " . date('Y') . " 3-1 Notary A Plus — Myrna Rodríguez</p>
          </div>
        </div>";

        try {
            $mail2 = createMailer();
            $mail2->addAddress($appt['email']);
            $mail2->Subject = $clientSubject;
            $mail2->Body    = $clientBody;
            $mail2->send();
        } catch (PHPMailerException $e) {
            error_log("NOTARY SMTP ERROR (cliente): " . $e->getMessage());
        }
    }
}

// ─── GET: slots disponibles ───────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $date = isset($_GET['date']) ? trim($_GET['date']) : '';

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        http_response_code(400);
        echo json_encode(['error' => 'Fecha inválida']);
        exit();
    }

    $dayOfWeek      = (int)date('w', strtotime($date . ' 12:00:00'));
    $availableSlots = $BUSINESS_HOURS[$dayOfWeek] ?? [];

    // Google Calendar is the single source of truth for slot availability.
    // appointments.json is kept as a log (for emails / reminders / admin
    // dashboard) but is NEVER consulted here — otherwise stale entries
    // would block real slots even after Myrna cancels in the calendar.
    $token      = gcalAccessToken();
    $bookedTimes = gcalBusySlots($date, $token);

    echo json_encode(['availableSlots' => $availableSlots, 'bookedTimes' => array_values($bookedTimes)]);
    exit();
}

// ─── POST: crear cita ─────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name              = isset($input['name'])              ? trim($input['name'])              : '';
    $phone             = isset($input['phone'])             ? trim($input['phone'])             : '';
    $email             = isset($input['email'])             ? trim($input['email'])             : '';
    $service           = isset($input['service'])           ? trim($input['service'])           : '';
    $date              = isset($input['date'])              ? trim($input['date'])              : '';
    $time              = isset($input['time'])              ? trim($input['time'])              : '';
    $notes             = isset($input['notes'])             ? trim($input['notes'])             : '';
    $createdBy         = isset($input['createdBy'])         ? trim($input['createdBy'])         : '';
    $adminCalendarId   = isset($input['adminCalendarId'])   ? trim($input['adminCalendarId'])   : '';
    $adminRefreshToken = isset($input['adminRefreshToken']) ? trim($input['adminRefreshToken']) : '';
    $adminColorId      = isset($input['adminColorId'])      ? trim($input['adminColorId'])      : '';

    if (!$name || !$phone || !$service || !$date || !$time) {
        http_response_code(400);
        echo json_encode(['error' => 'Faltan campos requeridos.']);
        exit();
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato de fecha inválido']);
        exit();
    }

    $dayOfWeek    = (int)date('w', strtotime($date . ' 12:00:00'));
    $allowedSlots = $BUSINESS_HOURS[$dayOfWeek] ?? [];

    if (empty($allowedSlots)) {
        http_response_code(400);
        echo json_encode(['error' => 'No hay servicio ese día (domingo).']);
        exit();
    }

    if (!in_array($time, $allowedSlots)) {
        http_response_code(400);
        echo json_encode(['error' => 'Hora fuera del horario de atención.']);
        exit();
    }

    // Google Calendar is the single source of truth for conflict detection.
    // We do NOT check appointments.json here — it would create false conflicts
    // from stale local entries that are no longer in the actual calendar.
    $token    = gcalAccessToken();
    $gcalBusy = gcalBusySlots($date, $token);
    if (in_array($time, $gcalBusy)) {
        http_response_code(409);
        echo json_encode(['error' => 'Ese horario ya está ocupado. Por favor selecciona otra hora.']);
        exit();
    }

    // Load the local log so we can append the new entry below (NOT for conflict checks).
    $appointments = readAppointments($DATA_FILE);

    $id = 'CIT-' . time() . rand(100, 999);
    $newAppt = [
        'id'        => $id,
        'name'      => $name,
        'phone'     => $phone,
        'email'     => $email,
        'service'   => $service,
        'date'      => $date,
        'time'      => $time,
        'notes'     => $notes,
        'createdAt' => date('c'),
    ];
    if ($createdBy !== '') {
        $newAppt['createdBy'] = $createdBy;
    }

    $appointments[] = $newAppt;
    if (!writeAppointments($DATA_FILE, $appointments)) {
        http_response_code(500);
        echo json_encode(['error' => 'Error guardando la cita. Inténtalo de nuevo.']);
        exit();
    }

    // Responder al cliente PRIMERO (rápido)
    http_response_code(201);
    echo json_encode(['success' => true, 'id' => $id]);

    // Cerrar la conexión para que el navegador no espere
    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    } else {
        ob_end_flush();
        flush();
    }

    // Ahora enviar emails y crear evento en Google Calendar (sin bloquear)
    // If admin fields provided, use them; otherwise use defaults from google-config.php
    $gcalToken   = ($adminRefreshToken !== '') ? gcalAccessToken($adminRefreshToken) : $token;
    $gcalCalId   = ($adminCalendarId !== '') ? $adminCalendarId : null;
    $gcalColorId = ($adminColorId !== '') ? $adminColorId : null;
    try { gcalCreateEvent($newAppt, $gcalToken, $SERVICE_LABELS, $gcalCalId, $gcalColorId); } catch (Exception $e) { error_log('GCal error: ' . $e->getMessage()); }
    try { sendEmails($newAppt, $CONTACT_EMAIL, $CONTACT_EMAIL2, $CONTACT_EMAIL3, $SERVICE_LABELS, $DAY_NAMES); } catch (Exception $e) { error_log('Email error: ' . $e->getMessage()); }

    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
