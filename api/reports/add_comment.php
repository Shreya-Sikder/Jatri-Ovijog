<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->report_id) && !empty($data->content)) {
    try {
        $query = "INSERT INTO post_comments (report_id, user_id, content) 
                 VALUES (:report_id, :user_id, :content)";

        $stmt = $db->prepare($query);
        $stmt->bindParam(":report_id", $data->report_id);
        $stmt->bindParam(":user_id", $data->user_id);
        $stmt->bindParam(":content", $data->content);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Comment added successfully."));
        }
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Error adding comment: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Missing required data."));
}
?>