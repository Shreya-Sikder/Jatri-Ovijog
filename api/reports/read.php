<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

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
              ORDER BY r.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $reports = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $report_item = array(
            "id" => $row['id'],
            "type" => $row['type'],
            "description" => $row['description'],
            "location" => json_decode($row['location']),
            "media_url" => $row['media_url'],
            "status" => $row['status'],
            "created_at" => $row['created_at'],
            "user_name" => $row['user_name'],
            "bus_company_name" => $row['bus_company_name'],
            "likes_count" => $row['likes_count'],
            "comments_count" => $row['comments_count']
        );
        array_push($reports, $report_item);
    }

    http_response_code(200);
    echo json_encode($reports);
} catch(PDOException $e) {
    http_response_code(503);
    echo json_encode(array("message" => "Unable to fetch reports: " . $e->getMessage()));
}
?>