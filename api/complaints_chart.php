<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json'); // Specify JSON content

// Include the database connection file
require_once '../config/database.php'; // Adjust the path as needed

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Create an instance of the Database class and get the connection
$database = new Database();
$conn = $database->getConnection();

if ($conn === null) {
    echo json_encode(['message' => 'Database connection failed.']);
    exit;
}

try {
    // Prepare the SQL query to fetch dynamic complaint statistics
    $stmt = $conn->prepare("
        SELECT 
    type,
    COUNT(*) AS total_complaints,
    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved_complaints,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_complaints,
    SUM(CASE WHEN status = 'unresolved' THEN 1 ELSE 0 END) AS unresolved_complaints
FROM complaints
GROUP BY type;

    ");

    $stmt->execute();

    // Fetch the complaint statistics
    $complaints = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the data in JSON format
    echo json_encode($complaints);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

?>
