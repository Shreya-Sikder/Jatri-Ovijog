<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if ($conn === null) {
    echo json_encode(['error' => 'Database connection failed.']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT e.id, e.message, e.created_at, u.name AS user_name, e.latitude, e.longitude
        FROM emergencies e
        LEFT JOIN users u ON e.user_id = u.id
        WHERE e.status = 'active'
        ORDER BY e.created_at DESC
        Limit 4
    ");
    $stmt->execute();
    $alerts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Debugging: Check the data before returning
    file_put_contents("php://stderr", print_r($alerts, true)); // Logs to server

    echo json_encode($alerts);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
