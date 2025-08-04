<?php
$password = 'admin'; // The password you want to hash
$hash = password_hash($password, PASSWORD_BCRYPT);
echo "Hashed password: " . $hash;
?>
