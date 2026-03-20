<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$DATA_FILE = __DIR__ . '/appointments.json';
$CONTACT_EMAIL = 'notaryaplus3_1@yahoo.com';

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

function readAppointments($file) {
    if (!file_exists($file)) return [];
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function writeAppointments($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function formatTime12h($time24) {
    list($h, $m) = explode(':', $time24);
    $h = (int)$h;
    $period = $h >= 12 ? 'PM' : 'AM';
    $h12 = $h % 12 === 0 ? 12 : $h % 12;
    return "$h12:$m $period";
}

function sendEmails($appt, $contactEmail, $serviceLabels, $dayNames) {
    $serviceLabel = isset($serviceLabels[$appt['service']]) ? $serviceLabels[$appt['service']] : $appt['service'];
    $dateObj = strtotime($appt['date'] . ' 12:00:00');
    $dayName = $dayNames[date('w', $dateObj)];
    $dateStr = $dayName . ', ' . date('F j, Y', $dateObj);
    $timeStr = formatTime12h($appt['time']);

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: 3-1 Notary A Plus <noreply@notaryaplus.com>\r\n";

    // Email a Myrna
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
        </table>
        <div style='margin-top:16px;padding:12px;background:#EAF7EF;border-left:4px solid #C8A214;border-radius:4px;'>
          <p style='margin:0;font-size:13px;color:#1B3356;'>ID de Cita: <strong>{$appt['id']}</strong></p>
        </div>
      </div>
      <div style='background:#1B3356;padding:16px;text-align:center;'>
        <p style='color:#C5E8D5;margin:0;font-size:12px;'>8514 Preston Hwy, Louisville, KY 40219 | (502) 654-7076</p>
      </div>
    </div>";

    @mail($contactEmail, $subject, $body, $headers);

    // Confirmación al cliente
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
              <p style='margin:4px 0;font-size:13px;'><strong>Email:</strong> notaryaplus3_1@yahoo.com</p>
            </div>
            <p style='margin-top:16px;font-size:13px;color:#666;'>Si necesitas cancelar o reprogramar, llámanos con al menos 24 horas de anticipación.</p>
          </div>
          <div style='background:#1B3356;padding:16px;text-align:center;'>
            <p style='color:#C5E8D5;margin:0;font-size:12px;'>&copy; " . date('Y') . " 3-1 Notary A Plus — Myrna Rodríguez</p>
          </div>
        </div>";

        @mail($appt['email'], $clientSubject, $clientBody, $headers);
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

    $dayOfWeek = (int)date('w', strtotime($date . ' 12:00:00'));
    $availableSlots = isset($BUSINESS_HOURS[$dayOfWeek]) ? $BUSINESS_HOURS[$dayOfWeek] : [];

    $appointments = readAppointments($DATA_FILE);
    $bookedTimes = [];
    foreach ($appointments as $a) {
        if ($a['date'] === $date) {
            $bookedTimes[] = $a['time'];
        }
    }

    echo json_encode(['availableSlots' => $availableSlots, 'bookedTimes' => $bookedTimes]);
    exit();
}

// ─── POST: crear cita ─────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name    = isset($input['name'])    ? trim($input['name'])    : '';
    $phone   = isset($input['phone'])   ? trim($input['phone'])   : '';
    $email   = isset($input['email'])   ? trim($input['email'])   : '';
    $service = isset($input['service']) ? trim($input['service']) : '';
    $date    = isset($input['date'])    ? trim($input['date'])    : '';
    $time    = isset($input['time'])    ? trim($input['time'])    : '';
    $notes   = isset($input['notes'])   ? trim($input['notes'])   : '';

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

    $dayOfWeek = (int)date('w', strtotime($date . ' 12:00:00'));
    $allowedSlots = isset($BUSINESS_HOURS[$dayOfWeek]) ? $BUSINESS_HOURS[$dayOfWeek] : [];

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

    $appointments = readAppointments($DATA_FILE);

    // Verificar conflicto
    foreach ($appointments as $a) {
        if ($a['date'] === $date && $a['time'] === $time) {
            http_response_code(409);
            echo json_encode(['error' => 'Ese horario ya está ocupado. Por favor selecciona otra hora.']);
            exit();
        }
    }

    // Nueva cita
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

    $appointments[] = $newAppt;
    writeAppointments($DATA_FILE, $appointments);

    sendEmails($newAppt, $CONTACT_EMAIL, $SERVICE_LABELS, $DAY_NAMES);

    http_response_code(201);
    echo json_encode(['success' => true, 'id' => $id]);
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
