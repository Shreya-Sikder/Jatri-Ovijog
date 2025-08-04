<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include the database connection file
require_once '../config/database.php'; // Adjust the path if needed

// Parse JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['latitude'], $data['longitude'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Latitude and longitude are required.']);
    exit;
}

// Assign input values
$latitude = $data['latitude'];
$longitude = $data['longitude'];

// Generate a unique ID for the primary key
$id = uniqid(); // Generates a unique ID (e.g., 5f6d7a1b5e1a1)

// Establish a database connection
$database = new Database();
$conn = $database->getConnection();

if ($conn === null) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed.']);
    exit;
}

try {
    // Prepare the SQL query
    $stmt = $conn->prepare("
        INSERT INTO emergencies (id, latitude, longitude, status, created_at)
        VALUES (:id, :latitude, :longitude, 'active', NOW())
    ");
    // Bind parameters
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':latitude', $latitude);
    $stmt->bindParam(':longitude', $longitude);

    // Execute the query
    $stmt->execute();

    // Send success response
    http_response_code(201);
    echo json_encode(['message' => 'Emergency alert saved successfully.']);
} catch (PDOException $e) {
    // Log the error for debugging
    file_put_contents('error_log.txt', $e->getMessage() . PHP_EOL, FILE_APPEND);

    // Send error response
    http_response_code(500);
    echo json_encode(['message' => 'Error saving emergency alert: ' . $e->getMessage()]);
}
?>
