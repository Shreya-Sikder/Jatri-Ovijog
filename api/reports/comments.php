<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_GET['report_id'])) {
    try {
        $query = "SELECT 
                    c.*,
                    u.name as user_name
                 FROM 
                    post_comments c
                    LEFT JOIN users u ON c.user_id = u.id
                 WHERE 
                    c.report_id = :report_id
                 ORDER BY 
                    c.created_at DESC";

        $stmt = $db->prepare($query);
        $stmt->bindParam(":report_id", $_GET['report_id']);
        $stmt->execute();

        $comments = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($comments, array(
                "id" => $row['id'],
                "content" => $row['content'],
                "user_name" => $row['user_name'],
                "created_at" => $row['created_at']
            ));
        }

        http_response_code(200);
        echo json_encode($comments);
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Error fetching comments: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Missing report ID."));
}
?>