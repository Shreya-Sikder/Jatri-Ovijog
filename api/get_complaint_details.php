<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Include the database connection
require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if ($conn === null) {
    echo json_encode(["error" => "Database connection failed."]);
    exit;
}

// Get the complaint ID from the query string
$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
    echo json_encode(["error" => "Complaint ID is required."]);
    exit;
}

try {
    // Query to fetch complaint details from both tables
    $query = "
    (
        SELECT 
            c.id AS complaint_id, 
            c.title, 
            c.type, 
            c.description, 
            c.thana, 
            c.status, 
            c.created_at, 
            NULL AS location, 
            NULL AS media_urls,
            IF(NULL, NULL, CONCAT('http://localhost/project/api/reports/uploads/', NULL)) AS image
        FROM complaints c
        WHERE c.id = :id
    )
    UNION ALL
    (
        SELECT 
            r.id AS complaint_id, 
            NULL AS title, 
            r.type, 
            r.description, 
            r.thana, 
            r.status, 
            r.created_at, 
            r.location, 
            r.media_urls,
            IF(r.media_urls IS NOT NULL, CONCAT('http://localhost/project/api/reports/', r.media_urls), NULL) AS image
        FROM reports r
        WHERE r.id = :id
    )";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $complaint = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$complaint) {
        echo json_encode(["error" => "Complaint not found."]);
    } else {
        echo json_encode($complaint, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
