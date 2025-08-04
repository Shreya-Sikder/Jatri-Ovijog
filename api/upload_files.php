<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploads_dir = 'uploads/complaints/';
    $media_urls = [];

    if (!is_dir($uploads_dir)) {
        mkdir($uploads_dir, 0777, true);
    }

    foreach ($_FILES['files']['tmp_name'] as $key => $tmp_name) {
        $file_name = basename($_FILES['files']['name'][$key]);
        $file_path = $uploads_dir . uniqid() . '_' . $file_name;

        if (move_uploaded_file($tmp_name, $file_path)) {
            $media_urls[] = $file_path;
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to upload files']);
            exit;
        }
    }

    echo json_encode(['media_urls' => $media_urls]);
}
