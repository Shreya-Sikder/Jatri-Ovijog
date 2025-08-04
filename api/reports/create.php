<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->user_id) &&
    !empty($data->type) &&
    !empty($data->description)
) {
    try {
        // Handle image upload
        $media_url = null;
        if (isset($_FILES['image'])) {
            $target_dir = "../../uploads/";
            $file_extension = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
            $new_filename = uniqid() . '.' . $file_extension;
            $target_file = $target_dir . $new_filename;
            
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                $media_url = $new_filename;
            }
        }

        // Create report
        $query = "INSERT INTO reports 
                    (user_id, type, description, location, media_url, status, created_at) 
                 VALUES 
                    (:user_id, :type, :description, :location, :media_url, 'pending', NOW())";

        $stmt = $db->prepare($query);

        $stmt->bindParam(":user_id", $data->user_id);
        $stmt->bindParam(":type", $data->type);
        $stmt->bindParam(":description", $data->description);
        $stmt->bindParam(":location", json_encode($data->location));
        $stmt->bindParam(":media_url", $media_url);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Report created successfully."));
        }
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create report: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create report. Data is incomplete."));
}
?>