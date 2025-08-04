<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (isset($_GET['id'])) {
    try {
        $query = "SELECT 
                    r.*, 
                    u.name as user_name,
                    bc.name as bus_company_name,
                    (SELECT COUNT(*) FROM post_likes WHERE report_id = r.id) as likes_count,
                    (SELECT COUNT(*) FROM post_comments WHERE report_id = r.id) as comments_count
                  FROM 
                    reports r
                    LEFT JOIN users u ON r.user_id = u.id
                    LEFT JOIN bus_companies bc ON r.bus_company_id = bc.id
                  WHERE r.id = :id";

        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $_GET['id']);
        $stmt->execute();

        if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $report = array(
                "id" => $row['id'],
                "type" => $row['type'],
                "description" => $row['description'],
                "location" => json_decode($row['location']),
                "media_urls" => json_decode($row['media_urls']),
                "status" => $row['status'],
                "created_at" => $row['created_at'],
                "user_name" => $row['user_name'],
                "bus_company_name" => $row['bus_company_name'],
                "likes_count" => $row['likes_count'],
                "comments_count" => $row['comments_count']
            );

            http_response_code(200);
            echo json_encode($report);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Report not found."));
        }
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Error fetching report: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Missing report ID."));
}
?>