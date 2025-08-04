<?php
// Headers for CORS and content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$host = "localhost";
$username = "root";
$password = "";
$dbname = "jatri_ovijog";

$conn = new mysqli($host, $username, $password, $dbname);

// Check for database connection errors
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Fetch sorting filter and validate
$filter = isset($_GET['filter']) ? $_GET['filter'] : 'most_recent';
$validFilters = ['most_upvote', 'most_downvote', 'most_recent'];
if (!in_array($filter, $validFilters)) {
    $filter = 'most_recent';
}

// Determine the ORDER BY clause based on the filter
switch ($filter) {
    case 'most_upvote':
        $orderBy = "r.upvotes DESC";
        break;
    case 'most_downvote':
        $orderBy = "r.downvotes DESC";
        break;
    case 'most_recent':
    default:
        $orderBy = "r.created_at DESC";
        break;
}

// Construct the SQL query
$sql = "SELECT r.id, 
               r.type, 
               r.description, 
               r.status, 
               r.location, 
               IF(r.media_urls IS NOT NULL, CONCAT('http://localhost/project/api/reports/', TRIM(LEADING '/' FROM r.media_urls)), NULL) AS media_urls, 
               r.upvotes, 
               r.downvotes, 
               r.created_at, 
               COALESCE(u.name, 'Unknown') AS user_name
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY $orderBy
        LIMIT 10;";

// Execute the query
$result = $conn->query($sql);

// Handle query errors
if ($result === false) {
    http_response_code(500);
    file_put_contents('debug_log.txt', "SQL Error: " . $conn->error . PHP_EOL, FILE_APPEND);
    echo json_encode(["error" => "Failed to execute query: " . $conn->error]);
    exit;
}

// Check if any reports are found
if ($result->num_rows > 0) {
    $reports = [];
    while ($row = $result->fetch_assoc()) {
        $reports[] = $row;
    }
    // Return the reports as a JSON response
    echo json_encode($reports, JSON_UNESCAPED_SLASHES);
} else {
    // No reports found
    http_response_code(404);
    echo json_encode(["message" => "No reports found."]);
}
?>
