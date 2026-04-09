<?php
session_start();

if (isset($_SESSION['admin_user'])) {
    header('Location: dashboard.php');
    exit();
}

require_once __DIR__ . '/admin-config.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (isset($ADMINS[$username]) && password_verify($password, $ADMINS[$username]['password_hash'])) {
        $_SESSION['admin_user']     = $username;
        $_SESSION['admin_name']     = $ADMINS[$username]['name'];
        $_SESSION['admin_cal_id']   = $ADMINS[$username]['calendar_id'];
        $_SESSION['admin_color']    = $ADMINS[$username]['event_color'];
        $_SESSION['admin_rt']       = $ADMINS[$username]['refresh_token'];
        header('Location: dashboard.php');
        exit();
    } else {
        $error = 'Usuario o contraseña incorrectos';
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
