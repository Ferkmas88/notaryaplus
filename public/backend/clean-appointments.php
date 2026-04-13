<?php
// One-shot cleanup endpoint — empties appointments.json.
// Token-protected. Only needed because the file held stale entries from
// before Google Calendar became the single source of truth for availability.
// Safe to run: the file is only a log for emails/reminders now; real new
// bookings will repopulate it normally.

header('Content-Type: application/json; charset=utf-8');

$token = $_GET['t'] ?? '';
if ($token !== 'clean-2026-04-13-notary') {
    http_response_code(403);
    echo json_encode(['error' => 'forbidden']);
    exit();
}

$DATA_FILE = __DIR__ . '/appointments.json';

if (!file_exists($DATA_FILE)) {
    echo json_encode(['success' => true, 'note' => 'file did not exist, nothing to clean']);
    exit();
}

$raw  = file_get_contents($DATA_FILE);
$data = json_decode($raw, true);
$before = is_array($data) ? count($data) : -1;

$ok = file_put_contents($DATA_FILE, "[]", LOCK_EX);

echo json_encode([
    'success'      => $ok !== false,
    'entries_before' => $before,
    'entries_after'  => 0,
], JSON_PRETTY_PRINT);
