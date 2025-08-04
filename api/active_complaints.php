<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Database credentials
$host = "localhost";
$username = "root";
$password = "";
$dbname = "jatri_ovijog";

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch the 5 most recent complaints and reports
$sql = "(
            SELECT 
                c.id AS complaint_id, 
                COALESCE(c.title, 'No Title') AS title, 
                c.type, 
                c.description, 
                c.thana, 
                c.location, 
                c.status, 
                c.created_at, 
                u.name AS user_name
            FROM complaints c
            LEFT JOIN users u ON c.user_id = u.id
        )
        UNION ALL
        (
            SELECT 
                r.id AS complaint_id,
                'Report' AS title, -- Assign a generic title for reports
                r.type,
                r.description,
                r.thana,
                r.location,
                r.status,
                r.created_at,
                u.name AS user_name
            FROM reports r
            LEFT JOIN users u ON r.user_id = u.id
        )
        ORDER BY created_at DESC
        LIMIT 10;";

$result = $conn->query($sql);

// Check if query execution was successful
if ($result === false) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to execute query: " . $conn->error]);
    exit;
}

// Prepare the response
if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    http_response_code(404);
    echo json_encode(["message" => "No data found."]);
}

// Close the database connection
$conn->close();
?>
