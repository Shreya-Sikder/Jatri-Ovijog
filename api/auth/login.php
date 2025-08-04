<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database configuration
include_once '../../config/database.php';

// Initialize database connection
$database = new Database();
$db = $database->getConnection();

// Get input data from the request
$data = json_decode(file_get_contents("php://input"));

// Validate input data
if (!empty($data->email) && !empty($data->password)) {
    // Prepare SQL query
    $query = "SELECT id, email, encrypted_password, role FROM auth_users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();

    // Fetch user data
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Verify password
        echo $row['encrypted_password'];
        //if (password_verify($data->password, $row['encrypted_password'])) {
        if($data->password==$row['encrypted_password']){
            // Generate a session token
            $token = bin2hex(random_bytes(32));
            http_response_code(200);
            echo json_encode([
                "user" => [
                    "id" => $row['id'],
                    "email" => $row['email'],
                    //"name" => $row['name'],
                    "role" => $row['role'],
                ],
                "token" => $token,
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid credentials"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "User not found"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data"]);
}
?>
