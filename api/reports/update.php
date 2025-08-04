<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (isset($_GET['id'])) {
    try {
        $query = "UPDATE reports 
                 SET status = :status,
                     priority = :priority,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id";

        $stmt = $db->prepare($query);
        
        $stmt->bindParam(":status", $data->status);
        $stmt->bindParam(":priority", $data->priority);
        $stmt->bindParam(":id", $_GET['id']);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Report updated successfully."));
        }
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update report: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Missing report ID."));
}
?>