<?php
header('Content-Type: application/json');


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json'); // Specify JSON content
// Database connection parameters
$host = 'localhost';
$username = 'root';
$password = ''; // Replace with your DB password
$database = 'jatri_ovijog';

// Connect to the database
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Get the JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['name'], $input['email'], $input['phone'], $input['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required."]);
    exit;
}

$name = $conn->real_escape_string($input['name']);
$email = $conn->real_escape_string($input['email']);
$phone = $conn->real_escape_string($input['phone']);
$password = password_hash($input['password'], PASSWORD_BCRYPT); // Hash the password

// Insert into the database
$sql = "INSERT INTO passengers (name, email, phone, password) VALUES ('$name', '$email', '$phone', '$password')";

if ($conn->query($sql) === TRUE) {
    http_response_code(201);
    echo json_encode(["message" => "Registration successful."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error: " . $conn->error]);
}

// Close the connection
$conn->close();
?>
