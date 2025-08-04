
<?php



ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *'); // Allow all origins
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json'); // Specify JSON content

// Include the database connection file
require_once '../config/database.php'; // Adjust the path as needed

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Create an instance of the Database class and get the connection
$database = new Database();
$conn = $database->getConnection();

if ($conn === null) {
    echo json_encode(['message' => 'Database connection failed.']);
    exit;
}

try {
    $stmt = $conn->prepare("
       SELECT * FROM reports ORDER BY created_at DESC
    ");
    $stmt->execute();

    $complaints = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($complaints);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}




?>


