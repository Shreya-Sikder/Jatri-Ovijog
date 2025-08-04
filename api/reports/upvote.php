<?php

header("Access-Control-Allow-Origin: *"); // Allows requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allowed HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); // Allowed headers

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Respond OK to preflight requests
    exit();
}

$host = "localhost";
$username = "root";
$password = "";
$dbname = "jatri_ovijog";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $sql = "UPDATE reports SET upvotes = upvotes + 1 WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => "Upvote successful"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to upvote: " . $conn->error]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request"]);
}

$conn->close();
?>
