<?php
header('Content-Type: application/json');

// Include database connection
include '../db.php';

// Get the JSON input from the client
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (
    empty($data['name']) ||
    empty($data['email']) ||
    empty($data['phone']) ||
    empty($data['password']) ||
    empty($data['confirmPassword'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit;
}

// Check if passwords match
if ($data['password'] !== $data['confirmPassword']) {
    http_response_code(400);
    echo json_encode(['error' => "Passwords don't match."]);
    exit;
}

try {
    // Check if the email already exists
    $stmt = $pdo->prepare('SELECT * FROM passengers WHERE email = :email');
    $stmt->execute(['email' => $data['email']]);
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Email is already registered.']);
        exit;
    }

    // Insert the user into the database
    $stmt = $pdo->prepare('INSERT INTO passengers (name, email, phone, password, role, created_at) VALUES (:name, :email, :phone, :password, :role, NOW())');
    $stmt->execute([
        'name' => $data['name'],
        'email' => $data['email'],
        'phone' => $data['phone'],
        'password' => password_hash($data['password'], PASSWORD_BCRYPT), // Securely hash the password
        'role' => 'passenger',
    ]);

    // Respond with success
    http_response_code(201);
    echo json_encode(['message' => 'Account created successfully.']);
} catch (PDOException $e) {
    // Handle database errors
    http_response_code(500);
    echo json_encode(['error' => 'Failed to register user. Please try again.']);
}
