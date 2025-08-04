<?php
header('Content-Type: application/json');
include '../db.php'; // Include your database connection

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['name']) || empty($data['email']) || empty($data['phone']) || empty($data['policeId']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit;
}

try {
    $stmt = $pdo->prepare('INSERT INTO police (name, email, phone, police_id, password, created_at) VALUES (:name, :email, :phone, :police_id, :password, NOW())');
    $stmt->execute([
        ':name' => $data['name'],
        ':email' => $data['email'],
        ':phone' => $data['phone'],
        ':police_id' => $data['policeId'],
        ':password' => password_hash($data['password'], PASSWORD_BCRYPT),
    ]);

    http_response_code(201);
    echo json_encode(['message' => 'Police account created successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create account. Please try again.']);
}
?>
