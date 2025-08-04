<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Include the database connection
require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if ($conn === null) {
    echo json_encode(["message" => "Database connection failed."]);
    exit;
}

try {
    // Get filters from the request
    $thana = isset($_GET['thana']) ? $_GET['thana'] : '';
    $status = isset($_GET['status']) ? $_GET['status'] : '';

    // Base query
    $query = "
        SELECT 
            r.id, 
            r.type, 
            r.description, 
            r.status, 
            r.created_at, 
            COALESCE(u.name, 'Unknown') AS user_name, 
            r.thana,
            r.vehicle_number  -- Added vehicle_number to the SELECT query
        FROM reports r
        LEFT JOIN users u ON r.user_id = u.id
    ";

    // Add conditions for filters
    $conditions = [];
    if (!empty($thana) && $thana !== 'All Thanas') {
        $conditions[] = "r.thana = :thana";
    }
    if (!empty($status) && $status !== 'All Status') {
        $conditions[] = "r.status = :status";
    }

    if (count($conditions) > 0) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }

    // Order by most recent
    $query .= " ORDER BY r.created_at DESC LIMIT 10";

    $stmt = $conn->prepare($query);

    // Bind parameters
    if (!empty($thana) && $thana !== 'All Thanas') {
        $stmt->bindParam(':thana', $thana);
    }
    if (!empty($status) && $status !== 'All Status') {
        $stmt->bindParam(':status', $status);
    }

    $stmt->execute();

    $num = $stmt->rowCount();

    if ($num > 0) {
        $complaints = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $complaints[] = [
                'id' => $row['id'],
                'type' => ucwords(str_replace('-', ' ', $row['type'])),
                'description' => $row['description'],
                'status' => $row['status'],
                'created_at' => $row['created_at'],
                'user_name' => $row['user_name'],
                'thana' => $row['thana'] ?: 'Unknown',
                'vehicle_number' => $row['vehicle_number'] ?: 'Not Provided', // Added vehicle_number to response
            ];
        }

        echo json_encode($complaints, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    } else {
        echo json_encode(["message" => "No complaints found for the selected filters."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
