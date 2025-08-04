<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); // Allow specific headers
header("Content-Type: application/json"); // Set the response content type

$host = "localhost";
$username = "root"; // Default XAMPP username
$password = ""; // Default XAMPP password
$dbname = "jatri_ovijog"; // Replace with your database name

// Establish connection using mysqli
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Define the ordering parameter (default: created_at DESC)
$orderBy = "created_at DESC"; // You can customize this based on your requirements (e.g., "id DESC")

try {
    // SQL query with a LEFT JOIN to fetch reports and user details
    $query = "
        SELECT 
            r.id, 
            r.type, 
            r.description, 
            r.status, 
            r.created_at, 
            COALESCE(u.name, 'Unknown') AS user_name
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY $orderBy
        LIMIT 3
    ";
    
    // Execute the query
    $result = $conn->query($query);

    // Check if the query was successful
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    // Fetch results and format as an associative array
    $reports = [];
    while ($row = $result->fetch_assoc()) {
        $reports[] = $row;
    }

    // Return JSON response
    echo json_encode($reports);

} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to fetch reports: ' . $e->getMessage()]);
}

// Close the database connection
$conn->close();
?>
