<?php
session_start();

if (!isset($_SESSION['admin_user'])) {
    header('Location: index.php');
    exit();
}

$adminName = $_SESSION['admin_name'];
$adminUser = $_SESSION['admin_user'];

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

$DATA_FILE = __DIR__ . '/../appointments.json';

// Read upcoming appointments (next 14 days)
function readAppointments($file) {
    if (!file_exists($file)) return [];
    $raw = file_get_contents($file);
    if ($raw === false || trim($raw) === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

$appointments = readAppointments($DATA_FILE);
$tz = new DateTimeZone('America/Kentucky/Louisville');
$today = new DateTime('now', $tz);
$today->setTime(0,0,0);
$limit = (clone $today)->modify('+14 days');

$upcoming = [];
foreach ($appointments as $a) {
    try {
        $dt = new DateTime($a['date'] . ' 00:00:00', $tz);
        if ($dt >= $today && $dt <= $limit) {
            $upcoming[] = $a;
        }
    } catch (Exception $e) {}
}

usort($upcoming, function($a, $b) {
    $cmp = strcmp($a['date'], $b['date']);
    return $cmp !== 0 ? $cmp : strcmp($a['time'], $b['time']);
});

// Handle appointment creation via AJAX / form POST
$formSuccess = '';
$formError   = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_appt') {
    $payload = [
        'name'             => trim($_POST['name'] ?? ''),
        'phone'            => trim($_POST['phone'] ?? ''),
        'email'            => trim($_POST['email'] ?? ''),
        'service'          => trim($_POST['service'] ?? ''),
        'date'             => trim($_POST['date'] ?? ''),
        'time'             => trim($_POST['time'] ?? ''),
        'notes'            => trim($_POST['notes'] ?? ''),
        'createdBy'        => $adminName,
        'adminCalendarId'  => $_SESSION['admin_cal_id'] ?? '',
        'adminRefreshToken'=> $_SESSION['admin_rt'] ?? '',
        'adminColorId'     => $_SESSION['admin_color'] ?? '',
    ];

    $ch = curl_init(__DIR__ . '/../citas.php');
    // Use HTTP request instead of file path
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host     = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $basePath = dirname(dirname(str_replace($_SERVER['DOCUMENT_ROOT'], '', __FILE__)));
    $url      = $protocol . '://' . $host . $basePath . '/citas.php';

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_SSL_VERIFYPEER => false,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $decoded = json_decode($res, true);
    if ($code === 201 && !empty($decoded['success'])) {
        $formSuccess = 'Cita creada exitosamente. ID: ' . ($decoded['id'] ?? '');
        // Reload appointments
        $appointments = readAppointments($DATA_FILE);
        $upcoming = [];
        foreach ($appointments as $a) {
            try {
                $dt = new DateTime($a['date'] . ' 00:00:00', $tz);
                if ($dt >= $today && $dt <= $limit) $upcoming[] = $a;
            } catch (Exception $e) {}
        }
        usort($upcoming, function($a, $b) {
            $cmp = strcmp($a['date'], $b['date']);
            return $cmp !== 0 ? $cmp : strcmp($a['time'], $b['time']);
        });
    } else {
        $formError = $decoded['error'] ?? 'Error al crear la cita. Código: ' . $code;
    }
}

function formatTime12h($t) {
    list($h,$m) = explode(':', $t);
    $h = (int)$h;
    $p = $h >= 12 ? 'PM' : 'AM';
    $h12 = $h % 12 === 0 ? 12 : $h % 12;
    return "$h12:$m $p";
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard — 3-1 Notary A Plus</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #f0f2f5; color: #222; }

    /* Header */
    header {
      background: #1B3356;
      padding: 14px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    header h1 { color: #C8A214; font-family: Georgia, serif; font-size: 20px; }
    header p  { color: #a0b8d0; font-size: 13px; margin-top: 2px; }
    .header-right { display: flex; align-items: center; gap: 16px; }
    .user-badge {
      background: rgba(200,162,20,0.15);
      border: 1px solid #C8A214;
      color: #C8A214;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
    }
    .logout-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.3);
      color: #ccc;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      text-decoration: none;
    }
    .logout-btn:hover { background: rgba(255,255,255,0.1); }

    /* Layout */
    main { max-width: 1100px; margin: 0 auto; padding: 32px 20px; }
    .grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 28px; }
    @media(max-width: 768px) { .grid { grid-template-columns: 1fr; } }

    /* Cards */
    .card {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .card-header {
      background: #1B3356;
      color: #C8A214;
      padding: 16px 22px;
      font-family: Georgia, serif;
      font-size: 16px;
      font-weight: bold;
    }
    .card-body { padding: 22px; }

    /* Form */
    .form-group { margin-bottom: 16px; }
    .form-group label {
      display: block;
      font-size: 12px;
      font-weight: bold;
      color: #1B3356;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 9px 12px;
      border: 1.5px solid #d5d5d5;
      border-radius: 6px;
      font-size: 14px;
      font-family: Arial, sans-serif;
      transition: border-color 0.2s;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #1B3356;
    }
    .form-group textarea { resize: vertical; min-height: 70px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .created-by-badge {
      background: #f0f4ff;
      border: 1px solid #c0cfe8;
      border-radius: 6px;
      padding: 9px 12px;
      font-size: 13px;
      color: #1B3356;
    }
    .submit-btn {
      width: 100%;
      padding: 12px;
      background: #C8A214;
      color: #1B3356;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: bold;
      font-family: Georgia, serif;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 6px;
    }
    .submit-btn:hover { background: #b8930f; }

    /* Alerts */
    .alert { padding: 11px 16px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; }
    .alert-success { background: #eaf7ef; border-left: 4px solid #27ae60; color: #1e7e44; }
    .alert-error   { background: #fff0f0; border-left: 4px solid #c0392b; color: #c0392b; }

    /* Table */
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead th {
      background: #1B3356;
      color: #C8A214;
      padding: 11px 12px;
      text-align: left;
      font-weight: bold;
      white-space: nowrap;
    }
    tbody tr:nth-child(even) { background: #f7f8fb; }
    tbody tr:hover { background: #eef2f8; }
    tbody td { padding: 10px 12px; vertical-align: middle; border-bottom: 1px solid #eee; }
    .badge-admin {
      display: inline-block;
      background: #1B3356;
      color: #C8A214;
      font-size: 10px;
      padding: 2px 7px;
      border-radius: 10px;
      margin-left: 4px;
    }
    .empty-state { text-align: center; padding: 40px; color: #999; font-style: italic; }
  </style>
</head>
<body>

<header>
  <div>
    <h1>3-1 Notary A Plus</h1>
    <p>Panel de Administración</p>
  </div>
  <div class="header-right">
    <span class="user-badge">👤 <?= htmlspecialchars($adminName) ?></span>
    <a href="logout.php" class="logout-btn">Cerrar sesión</a>
  </div>
</header>

<main>
  <div class="grid">

    <!-- Create Appointment Form -->
    <div class="card">
      <div class="card-header">Nueva Cita</div>
      <div class="card-body">
        <?php if ($formSuccess): ?>
          <div class="alert alert-success"><?= htmlspecialchars($formSuccess) ?></div>
        <?php endif; ?>
        <?php if ($formError): ?>
          <div class="alert alert-error"><?= htmlspecialchars($formError) ?></div>
        <?php endif; ?>

        <form method="POST" action="">
          <input type="hidden" name="action" value="create_appt">

          <div class="form-group">
            <label>Creado por</label>
            <div class="created-by-badge"><?= htmlspecialchars($adminName) ?></div>
          </div>

          <div class="form-group">
            <label>Servicio *</label>
            <select name="service" required>
              <option value="">— Seleccionar —</option>
              <?php foreach ($SERVICE_LABELS as $key => $label): ?>
                <option value="<?= $key ?>" <?= (($_POST['service'] ?? '') === $key ? 'selected' : '') ?>>
                  <?= htmlspecialchars($label) ?>
                </option>
              <?php endforeach; ?>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Fecha *</label>
              <input type="date" name="date" required value="<?= htmlspecialchars($_POST['date'] ?? '') ?>">
            </div>
            <div class="form-group">
              <label>Hora *</label>
              <select name="time" required>
                <option value="">— Hora —</option>
                <?php
                $hours = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
                foreach ($hours as $h): ?>
                  <option value="<?= $h ?>" <?= (($_POST['time'] ?? '') === $h ? 'selected' : '') ?>>
                    <?= formatTime12h($h) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Nombre del cliente *</label>
            <input type="text" name="name" required value="<?= htmlspecialchars($_POST['name'] ?? '') ?>">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Teléfono *</label>
              <input type="tel" name="phone" required value="<?= htmlspecialchars($_POST['phone'] ?? '') ?>">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
            </div>
          </div>

          <div class="form-group">
            <label>Notas</label>
            <textarea name="notes"><?= htmlspecialchars($_POST['notes'] ?? '') ?></textarea>
          </div>

          <button type="submit" class="submit-btn">Crear Cita</button>
        </form>
      </div>
    </div>

    <!-- Upcoming Appointments -->
    <div class="card">
      <div class="card-header">Próximas Citas — 14 días</div>
      <div class="card-body" style="padding:0;">
        <?php if (empty($upcoming)): ?>
          <p class="empty-state">No hay citas en los próximos 14 días.</p>
        <?php else: ?>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                <?php foreach ($upcoming as $a):
                  $serviceLabel = $SERVICE_LABELS[$a['service']] ?? $a['service'];
                  $dateDisplay  = date('D d/m', strtotime($a['date'] . ' 12:00:00'));
                  $createdBy    = $a['createdBy'] ?? '';
                ?>
                <tr>
                  <td><?= htmlspecialchars($dateDisplay) ?></td>
                  <td><?= htmlspecialchars(formatTime12h($a['time'])) ?></td>
                  <td>
                    <?= htmlspecialchars($a['name']) ?>
                    <?php if ($createdBy): ?>
                      <span class="badge-admin" title="Creado por <?= htmlspecialchars($createdBy) ?>">
                        <?= htmlspecialchars($createdBy) ?>
                      </span>
                    <?php endif; ?>
                  </td>
                  <td><?= htmlspecialchars($serviceLabel) ?></td>
                  <td><?= htmlspecialchars($a['phone']) ?></td>
                </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        <?php endif; ?>
      </div>
    </div>

  </div>
</main>

</body>
</html>
