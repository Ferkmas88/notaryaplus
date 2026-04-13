<?php
// Google Calendar authentication via Service Account.
//
// Replaces the old OAuth refresh-token flow. Signs a JWT locally with the
// private key from service-account.json, exchanges it for a short-lived
// access token, and returns it. The key never expires, so this configuration
// is done once and keeps working indefinitely.
//
// Security: service-account.json is a master credential for the shared
// calendar. It MUST live outside the web root (one level above public_html)
// or be blocked via .htaccess. Never commit it to git.

function gcalServiceAccountKeyPath() {
    // Preferred location: one level above public_html (not web-accessible).
    // Adjust if your Hostinger layout differs.
    $candidates = [
        __DIR__ . '/../../../service-account.json',        // /home/USER/service-account.json
        __DIR__ . '/../../service-account.json',           // /home/USER/public_html/service-account.json
        __DIR__ . '/service-account.json',                 // /home/USER/public_html/backend/service-account.json (fallback, needs .htaccess)
    ];
    foreach ($candidates as $path) {
        if (is_file($path) && is_readable($path)) {
            return $path;
        }
    }
    return null;
}

function gcalBase64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function gcalServiceAccountToken($scope = 'https://www.googleapis.com/auth/calendar') {
    $keyPath = gcalServiceAccountKeyPath();
    if (!$keyPath) {
        error_log('[gcal-auth] service-account.json not found in any known location');
        return null;
    }

    $raw = file_get_contents($keyPath);
    if ($raw === false) {
        error_log('[gcal-auth] unable to read ' . $keyPath);
        return null;
    }

    $key = json_decode($raw, true);
    if (!is_array($key) || empty($key['private_key']) || empty($key['client_email'])) {
        error_log('[gcal-auth] invalid service-account.json structure');
        return null;
    }

    $tokenUri = $key['token_uri'] ?? 'https://oauth2.googleapis.com/token';

    $now = time();
    $header  = ['alg' => 'RS256', 'typ' => 'JWT'];
    $payload = [
        'iss'   => $key['client_email'],
        'scope' => $scope,
        'aud'   => $tokenUri,
        'iat'   => $now,
        'exp'   => $now + 3600,
    ];

    $segments = gcalBase64UrlEncode(json_encode($header)) . '.' . gcalBase64UrlEncode(json_encode($payload));

    $signature = '';
    $ok = openssl_sign($segments, $signature, $key['private_key'], 'SHA256');
    if (!$ok) {
        error_log('[gcal-auth] openssl_sign failed: ' . openssl_error_string());
        return null;
    }

    $jwt = $segments . '.' . gcalBase64UrlEncode($signature);

    $ch = curl_init($tokenUri);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $jwt,
        ]),
        CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($res === false || $code !== 200) {
        error_log('[gcal-auth] token exchange failed (HTTP ' . $code . '): ' . $res);
        return null;
    }

    $data = json_decode($res, true);
    return $data['access_token'] ?? null;
}
