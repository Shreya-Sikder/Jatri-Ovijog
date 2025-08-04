<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database connection
require_once '../config/database.php'; // Adjust the path if needed

// Get the input data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Complaint ID is required."]);
    exit;
}

$complaintId = $data['id'];

// Database connection
$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to connect to the database."]);
    exit;
}

try {
    // First, try to update the complaints table
    $query_complaints = "UPDATE complaints SET status = 'resolved' WHERE id = :id";
    $stmt_complaints = $conn->prepare($query_complaints);
    $stmt_complaints->bindParam(':id', $complaintId, PDO::PARAM_INT);
    $stmt_complaints->execute();

    // Check if any row in complaints table was updated
    $complaints_updated = $stmt_complaints->rowCount();

    if ($complaints_updated > 0) {
        echo json_encode(["message" => "Complaint resolved successfully in the complaints table."]);
        exit;
    }

    // If no row in complaints was updated, try the reports table
    $query_reports = "UPDATE reports SET status = 'resolved' WHERE id = :id";
    $stmt_reports = $conn->prepare($query_reports);
    $stmt_reports->bindParam(':id', $complaintId, PDO::PARAM_INT);
    $stmt_reports->execute();

    // Check if any row in reports table was updated
    $reports_updated = $stmt_reports->rowCount();

    if ($reports_updated > 0) {
        echo json_encode(["message" => "Complaint resolved successfully in the reports table."]);
        exit;
    }

    // If no rows were updated in either table
    http_response_code(404);
    echo json_encode(["error" => "Complaint not found or already resolved."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
