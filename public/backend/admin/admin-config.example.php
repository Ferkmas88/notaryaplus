<?php
// Admin credentials template — copy to admin-config.php and fill in real values
$ADMINS = [
    'myrna' => [
        'password_hash' => 'CHANGE_THIS', // use: password_hash('YourPassword', PASSWORD_DEFAULT)
        'name'          => 'Myrna Rodríguez',
        'calendar_id'   => 'notaryaplus31@gmail.com',
        'refresh_token' => '', // unused after Service Account migration — safe to leave empty
        'event_color'   => '5', // banana (yellow/gold)
    ],
    'cecilia' => [
        'password_hash' => 'CHANGE_THIS',
        'name'          => 'Cecilia',
        'calendar_id'   => 'cecilia1notaryaplus@gmail.com',
        'refresh_token' => '',
        'event_color'   => '7', // peacock (blue)
    ],
];
