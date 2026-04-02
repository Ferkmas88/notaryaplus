<?php
header('Content-Type: application/json; charset=utf-8');

$file = __DIR__ . '/appointments.json';
file_put_contents($file, '[]');

echo json_encode(['success' => true, 'message' => 'Citas borradas']);
