<?php
include_once('../db.php'); // Ensure the path to db.php is correct
header('Content-Type: application/json');
$postData = json_decode(file_get_contents("php://input"), true);

if (!isset($postData['email']) || !isset($postData['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

$email = $postData['email'];
$password = $postData['password'];

$query = "SELECT * FROM auth_users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['encrypted_password'])) {
        echo json_encode(['success' => true, 'user' => $row]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}
?>
