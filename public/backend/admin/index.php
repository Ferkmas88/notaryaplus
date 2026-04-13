<?php
session_start();

// Security headers for the admin panel — deny iframe embedding so the login
// cannot be wrapped in clickjacking overlays, disable referrer leaking, etc.
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if (isset($_SESSION['admin_user'])) {
    header('Location: dashboard.php');
    exit();
}

require_once __DIR__ . '/admin-config.php';

// Brute-force protection: 5 failed attempts per 15 minutes per IP, then lock.
// Uses the same JSON store as citas.php. Keeps the state file in the parent
// backend dir so both rate limiters share the same .htaccess protection.
function adminRateLimitCheck(): array {
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP']
        ?? $_SERVER['HTTP_X_FORWARDED_FOR']
        ?? $_SERVER['REMOTE_ADDR']
        ?? 'unknown';
    if (str_contains($ip, ',')) $ip = trim(explode(',', $ip)[0]);
    $file = __DIR__ . '/../.ratelimit.json';
    $data = [];
    if (file_exists($file)) {
        $raw  = @file_get_contents($file);
        $data = json_decode($raw, true) ?: [];
    }
    $key    = 'admin_fail|' . $ip;
    $now    = time();
    $cutoff = $now - 900; // 15 min window
    $hits   = array_filter($data[$key] ?? [], fn($t) => $t >= $cutoff);
    return [$ip, $data, $file, $key, array_values($hits)];
}

function adminRateLimitRecordFailure(string $ip, array $data, string $file, string $key, array $hits): void {
    $hits[]     = time();
    $data[$key] = $hits;
    @file_put_contents($file, json_encode($data), LOCK_EX);
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    [$ip, $rlData, $rlFile, $rlKey, $rlHits] = adminRateLimitCheck();

    if (count($rlHits) >= 5) {
        http_response_code(429);
        $error = 'Demasiados intentos fallidos. Intenta en 15 minutos.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (isset($ADMINS[$username]) && password_verify($password, $ADMINS[$username]['password_hash'])) {
            // Rotate session id on privilege change to prevent session fixation.
            session_regenerate_id(true);
            $_SESSION['admin_user']     = $username;
            $_SESSION['admin_name']     = $ADMINS[$username]['name'];
            $_SESSION['admin_cal_id']   = $ADMINS[$username]['calendar_id'];
            $_SESSION['admin_color']    = $ADMINS[$username]['event_color'];
            // admin_rt kept for backwards-compat with older sessions — no
            // longer used by citas.php (Service Account handles auth).
            $_SESSION['admin_rt']       = $ADMINS[$username]['refresh_token'] ?? '';
            header('Location: dashboard.php');
            exit();
        } else {
            adminRateLimitRecordFailure($ip, $rlData, $rlFile, $rlKey, $rlHits);
            // Generic error so we don't reveal whether the username exists.
            $error = 'Usuario o contraseña incorrectos';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — 3-1 Notary A Plus</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, serif;
      background: #0f1e33;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 40px 36px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .logo-area {
      text-align: center;
      margin-bottom: 28px;
    }
    .logo-area h1 {
      color: #1B3356;
      font-size: 22px;
      line-height: 1.2;
    }
    .logo-area span {
      color: #C8A214;
    }
    .logo-area p {
      color: #666;
      font-size: 12px;
      margin-top: 4px;
      font-family: Arial, sans-serif;
    }
    .divider {
      height: 3px;
      background: linear-gradient(90deg, #1B3356, #C8A214);
      border-radius: 2px;
      margin-bottom: 28px;
    }
    label {
      display: block;
      font-size: 13px;
      color: #1B3356;
      font-weight: bold;
      font-family: Arial, sans-serif;
      margin-bottom: 6px;
    }
    input {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid #d0d0d0;
      border-radius: 6px;
      font-size: 15px;
      font-family: Arial, sans-serif;
      margin-bottom: 18px;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #1B3356;
    }
    .btn {
      width: 100%;
      padding: 13px;
      background: #1B3356;
      color: #C8A214;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      font-family: Georgia, serif;
      cursor: pointer;
      transition: background 0.2s;
      letter-spacing: 0.5px;
    }
    .btn:hover { background: #142748; }
    .error {
      background: #fff0f0;
      border-left: 4px solid #c0392b;
      color: #c0392b;
      padding: 10px 14px;
      border-radius: 4px;
      font-size: 13px;
      font-family: Arial, sans-serif;
      margin-bottom: 18px;
    }
    .badge {
      text-align: center;
      margin-top: 20px;
      font-size: 11px;
      color: #aaa;
      font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-area">
      <h1>3-1 Notary <span>A Plus</span></h1>
      <p>Panel de Administración</p>
    </div>
    <div class="divider"></div>

    <?php if ($error): ?>
      <div class="error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST" action="">
      <label for="username">Usuario</label>
      <input type="text" id="username" name="username" autocomplete="username" required
             value="<?= htmlspecialchars($_POST['username'] ?? '') ?>">

      <label for="password">Contraseña</label>
      <input type="password" id="password" name="password" autocomplete="current-password" required>

      <button type="submit" class="btn">Ingresar</button>
    </form>
    <p class="badge">Acceso restringido — Solo personal autorizado</p>
  </div>
</body>
</html>
