<?php
$plaintext_password = "admin2222"; // Replace with the new password
$hashed_password = password_hash($plaintext_password, PASSWORD_BCRYPT);
echo $hashed_password;
?>
