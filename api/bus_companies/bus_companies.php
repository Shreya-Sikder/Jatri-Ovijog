<?php
// api/bus_companies/bus_company.php
include "../../config/database.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE'); // Allowed HTTP methods
header('Access-Control-Allow-Headers: Content-Type'); // Allow specific headers (like Content-Type)
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Create an instance of the Database class
$database = new Database();
$conn = $database->getConnection(); // Get the PDO connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = $input['name'] ?? null;
    $description = $input['description'] ?? null;

    if ($name) {
        $sql = "INSERT INTO `bus_companies` (`name`, `description`, `created_at`) VALUES (:name, :description, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Bus company created successfully.']);
        } else {
            echo json_encode(['message' => 'Failed to create bus company.']);
        }
    } else {
        echo json_encode(['message' => 'Invalid input.']);
    }
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $busCompanyList = [];
    $sql = "SELECT `id`, `name`, `description`, `created_at` FROM `bus_companies`";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $busCompanyList[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description'],
                'created_at' => $row['created_at'],
            ];
        }
    }

    echo json_encode($busCompanyList);
}
?>
