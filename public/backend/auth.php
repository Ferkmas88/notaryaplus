<?php
// ONE-TIME AUTH SCRIPT — DELETE AFTER USE
$client_id     = 'TU_CLIENT_ID_AQUI';
$client_secret = 'TU_CLIENT_SECRET_AQUI';
$redirect_uri  = 'https://notaryaplus.com/backend/auth.php';
$scope         = 'https://www.googleapis.com/auth/calendar';

if (!isset($_GET['code'])) {
    $auth_url = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
        'client_id'     => $client_id,
        'redirect_uri'  => $redirect_uri,
        'response_type' => 'code',
        'scope'         => $scope,
        'access_type'   => 'offline',
        'prompt'        => 'consent',
    ]);
    header('Location: ' . $auth_url);
    exit;
}

// Exchange code for tokens
$response = file_get_contents('https://oauth2.googleapis.com/token', false, stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query([
            'code'          => $_GET['code'],
            'client_id'     => $client_id,
            'client_secret' => $client_secret,
            'redirect_uri'  => $redirect_uri,
            'grant_type'    => 'authorization_code',
        ]),
    ],
]));

$tokens = json_decode($response, true);
echo '<pre>';
echo "REFRESH TOKEN: " . ($tokens['refresh_token'] ?? 'NOT FOUND — re-run with prompt=consent') . "\n\n";
echo "Access Token: " . ($tokens['access_token'] ?? 'error') . "\n";
echo "Full response:\n";
print_r($tokens);
echo '</pre>';
echo '<p style="color:red;font-weight:bold;">IMPORTANTE: Elimina este archivo del servidor ahora.</p>';
