<?php
header('Content-Type: application/json; charset=utf-8');

$DATA_FILE = __DIR__ . '/appointments.json';

if (!file_exists($DATA_FILE)) {
    echo json_encode(['error' => 'No existe el archivo']);
    exit();
}

$raw = file_get_contents($DATA_FILE);
$appointments = json_decode($raw, true);

if (!is_array($appointments)) {
    echo json_encode(['error' => 'Archivo corrupto']);
    exit();
}

$total = count($appointments);

// Eliminar: todas las del 15, y la del 16 a las 12:00
$filtered = array_filter($appointments, function($a) {
    // Eliminar todas las citas del 15 de abril 2026
    if ($a['date'] === '2026-04-15') return false;
    // Eliminar la cita del 16 de abril 2026 a las 12:00
    if ($a['date'] === '2026-04-16' && $a['time'] === '12:00') return false;
    return true;
});

$filtered = array_values($filtered);
$removed = $total - count($filtered);

file_put_contents($DATA_FILE, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

echo json_encode([
    'success' => true,
    'total_before' => $total,
    'removed' => $removed,
    'total_after' => count($filtered),
], JSON_PRETTY_PRINT);
