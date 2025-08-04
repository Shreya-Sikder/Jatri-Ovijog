<?php
// api/bus_company.php


include "../../config/database.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE'); // Allowed HTTP methods
header('Access-Control-Allow-Headers: Content-Type'); // Allow specific headers (like Content-Type)
// Set the header to specify JSON content
header('Content-Type: application/json');


// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Create an instance of the Database class
$database = new Database();
$conn = $database->getConnection(); // Get the PDO connection

// Check if the connection was successful
if ($conn === null) {
    echo json_encode(['message' => 'Database connection failed.']);
    exit;
}


$busCompanyList = [];

$sql = "SELECT `id`,`name` from `bus_companies`";



$stmt = $conn->prepare($sql);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $busCompanyList[] = [
            'id' => $row['id'],
            'name' => $row['name']
        ];
    }
}
else {
    echo json_encode(['message' => 'No records found.']);
}




echo json_encode($busCompanyList);
?>
