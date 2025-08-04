<?php
session_start();
session_destroy();
echo json_encode(['success' => true, 'message' => 'Signed out successfully']);
?>
