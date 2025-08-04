<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$username = "root";
$password = "";
$dbname = "jatri_ovijog"; // Replace with the actual database name

$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Query counts for each status
try {
    $newCasesQuery = "SELECT COUNT(*) AS count FROM reports";
    $inProgressQuery = "SELECT COUNT(*) AS count FROM reports WHERE status = 'pending'";
    $resolvedQuery = "SELECT COUNT(*) AS count FROM reports WHERE status = 'resolved'";
    $fakeQuery = "SELECT COUNT(*) AS count FROM reports WHERE status = 'fake'"; // Added fake status query

    $newCasesResult = $conn->query($newCasesQuery)->fetch_assoc();
    $inProgressResult = $conn->query($inProgressQuery)->fetch_assoc();
    $resolvedResult = $conn->query($resolvedQuery)->fetch_assoc();
    $fakeResult = $conn->query($fakeQuery)->fetch_assoc(); // Execute fake status query

    $response = [
        "new_cases" => $newCasesResult['count'], // All reports
        "in_progress" => $inProgressResult['count'], // Pending reports
        "resolved" => $resolvedResult['count'], // Resolved reports
        "fake_cases" => $fakeResult['count'] // Fake reports
    ];

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Query failed: " . $e->getMessage()]);
}

$conn->close();
?>
