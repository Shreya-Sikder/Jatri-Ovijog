<?php
header('Content-Type: application/json');

// Include the database connection
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../db.php';

try {
    // Fetch emergencies with status 'active', ordered by creation time (descending)
    $stmt = $pdo->query("SELECT * FROM emergencies WHERE status = 'active' ORDER BY created_at DESC");
    $emergencies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Respond with the emergencies as JSON
    echo json_encode($emergencies);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch emergencies: ' . $e->getMessage()]);
}
