<?php

session_start();
include_once '../db.php';

if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    $query = $conn->prepare("SELECT * FROM auth_users WHERE id = ?");
    $query->bind_param("s", $userId);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No user logged in']);
}
