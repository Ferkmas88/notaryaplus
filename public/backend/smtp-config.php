<?php
// ─── Configuración SMTP para Hostinger ──────────────────────────────────────
// Cambia estos valores según tu cuenta de email en Hostinger

// Si tienes email corporativo en Hostinger (ej: info@notaryaplus.com):
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465);
define('SMTP_SECURE', 'ssl');           // 'ssl' para puerto 465, 'tls' para 587
define('SMTP_USER', 'info@notaryaplus.com');  // Tu email de Hostinger
define('SMTP_PASS', '');                // Tu contraseña del email de Hostinger
define('SMTP_FROM_NAME', '3-1 Notary A Plus');

// Emails donde llegan las notificaciones de citas
define('CONTACT_EMAIL',  'notaryaplus31@gmail.com');
define('CONTACT_EMAIL2', 'notaryaplus3_1@yahoo.com');
