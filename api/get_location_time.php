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
    // Query to fetch location and time data
    $query = "
        SELECT 
            id, 
            location, 
            created_at 
        FROM reports
        ORDER BY created_at DESC
        Limit 4
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();

    $result = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $result[] = [
            "id" => $row['id'],
            "location" => $row['location'] ?: "Location not provided",
            "time" => $row['created_at'],
        ];
    }

    echo json_encode($result, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
