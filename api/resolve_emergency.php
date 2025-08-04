<?php

header('Content-Type: application/json');

// Include the database connection
include '../db.php';

// Get the input data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (empty($data['id']) || empty($data['resolved_by'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request: ID and resolved_by are required.']);
    exit;
}

try {
    // Update the emergency status to 'resolved'
    $stmt = $pdo->prepare(
        "UPDATE emergencies 
         SET status = 'resolved', resolved_at = NOW(), resolved_by = :resolved_by 
         WHERE id = :id"
    );
    $stmt->execute([
        ':id' => $data['id'],
        ':resolved_by' => $data['resolved_by'],
    ]);

    // Respond with success
    echo json_encode(['message' => 'Emergency resolved successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to resolve emergency: ' . $e->getMessage()]);
}
