<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json'); // Specify JSON content

$servername = "localhost";
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "jatri_ovijog"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Handle delete request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the unique ID from the POST request
    $complaint_id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    // Log received data for debugging (optional)
    file_put_contents('debug.log', "Received ID: " . $complaint_id . PHP_EOL, FILE_APPEND);

    if ($complaint_id > 0) {
        // Prepare the SQL DELETE query
        $sql = "DELETE FROM reports WHERE id = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            // Log preparation error
            file_put_contents('debug.log', "Prepare Error: " . $conn->error . PHP_EOL, FILE_APPEND);
            echo json_encode(["success" => false, "message" => "Error preparing the query."]);
            exit;
        }

        $stmt->bind_param("i", $complaint_id);

        if ($stmt->execute()) {
            // Check if the row was actually deleted
            if ($stmt->affected_rows > 0) {
                echo json_encode(["success" => true, "message" => "Complaint deleted successfully."]);
            } else {
                // Log if no rows were affected
                file_put_contents('debug.log', "No rows affected for ID: " . $complaint_id . PHP_EOL, FILE_APPEND);
                echo json_encode(["success" => false, "message" => "Complaint ID not found or already deleted."]);
            }
        } else {
            // Log execution error
            file_put_contents('debug.log', "Execute Error: " . $stmt->error . PHP_EOL, FILE_APPEND);
            echo json_encode(["success" => false, "message" => "Error executing delete query."]);
        }

        $stmt->close();
    } else {
        // Log invalid ID
        file_put_contents('debug.log', "Invalid complaint ID received: " . $complaint_id . PHP_EOL, FILE_APPEND);
        echo json_encode(["success" => false, "message" => "Invalid complaint ID."]);
    }
}

$conn->close();
?>
