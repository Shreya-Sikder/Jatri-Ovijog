<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$username = "root";
$password = "";
$dbname = "jatri_ovijog"; // Replace with your actual database name

$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Replace with the actual user ID of the logged-in user
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["error" => "User ID is required"]);
    exit;
}

// Query counts for the user's reports
try {
    $totalReportsQuery = "SELECT COUNT(*) AS count FROM reports WHERE user_id = ?";
    $pendingReportsQuery = "SELECT COUNT(*) AS count FROM reports WHERE user_id = ? AND status = 'pending'";
    $resolvedReportsQuery = "SELECT COUNT(*) AS count FROM reports WHERE user_id = ? AND status = 'resolved'";

    // Prepare and execute the total reports query
    $stmt = $conn->prepare($totalReportsQuery);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $totalReportsResult = $stmt->get_result()->fetch_assoc();

    // Prepare and execute the pending reports query
    $stmt = $conn->prepare($pendingReportsQuery);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $pendingReportsResult = $stmt->get_result()->fetch_assoc();

    // Prepare and execute the resolved reports query
    $stmt = $conn->prepare($resolvedReportsQuery);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $resolvedReportsResult = $stmt->get_result()->fetch_assoc();

    $response = [
        "total_reports" => $totalReportsResult['count'],
        "pending" => $pendingReportsResult['count'],
        "resolved" => $resolvedReportsResult['count']
    ];

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Query failed: " . $e->getMessage()]);
}

$conn->close();
?>
