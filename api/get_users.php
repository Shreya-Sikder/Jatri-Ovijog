<?php
include '../db.php'; // Include the database connection file

header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM auth_users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
