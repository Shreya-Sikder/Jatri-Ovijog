<?php
header('Content-Type: application/json');

// Include database connection
include '../db.php';

// Get JSON input from the frontend
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (empty($data['startPoint']) || empty($data['endPoint'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Start and end points are required.']);
    exit;
}

try {
    // Insert start and end points into the database
    $stmt = $pdo->prepare("INSERT INTO map_points (start_lat, start_lng, end_lat, end_lng) VALUES (:startLat, :startLng, :endLat, :endLng)");
    $stmt->execute([
        ':startLat' => $data['startPoint']['lat'],
        ':startLng' => $data['startPoint']['lng'],
        ':endLat' => $data['endPoint']['lat'],
        ':endLng' => $data['endPoint']['lng'],
    ]);

    // Respond with success
    http_response_code(201);
    echo json_encode(['message' => 'Map points saved successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save map points: ' . $e->getMessage()]);
}
