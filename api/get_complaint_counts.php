<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
require_once '../config/database.php';
$database = new Database();
$conn = $database->getConnection();

if ($conn === null) {
    echo json_encode(["message" => "Database connection failed."]);
    exit;
}

try {
    // Query to count complaints by type and status
    $query = "
        SELECT 
            type, 
            SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN status = 'fake' THEN 1 ELSE 0 END) AS fake
        FROM reports
        GROUP BY type
        ORDER BY type ASC
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();

    $result = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $result[] = [
            "type" => $row['type'],
            "resolved" => (int) $row['resolved'],
            "pending" => (int) $row['pending'],
            "fake" => (int) $row['fake'],
        ];
    }

    echo json_encode($result, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
