<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');
require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $complaintId = $_GET['complaint_id'] ?? '';

    if (empty($complaintId)) {
        echo json_encode(['error' => 'Complaint ID is required.']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT title, description, image FROM complaints WHERE complaint_id = :complaint_id");
        $stmt->bindParam(':complaint_id', $complaintId);
        $stmt->execute();

        $complaint = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$complaint) {
            echo json_encode(['error' => 'Complaint not found.']);
        } else {
            echo json_encode($complaint);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
