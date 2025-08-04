<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$GOOGLE_MAPS_API_KEY = "AIzaSyAvoCved649tV8ZgSXsdmpXwvkzb71l8Hc"; // Replace with your Google Maps API key
$BUS_RATE_PER_KM = 2.42; // Fare per km
$MINIMUM_FARE = 10; // Minimum fare
$STUDENT_DISCOUNT = 0.5; // 50% discount for students

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $startLocation = $data['startLocation'] ?? null;
    $endLocation = $data['endLocation'] ?? null;
    $isStudent = $data['isStudent'] ?? false;

    if (!$startLocation || !$endLocation) {
        http_response_code(400);
        echo json_encode(['error' => 'Start location and end location are required.']);
        exit;
    }

    try {
        $distance = calculateDistance($startLocation, $endLocation, $GOOGLE_MAPS_API_KEY);

        if ($distance === null) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to calculate distance.']);
            exit;
        }

        $fare = max($distance * $BUS_RATE_PER_KM, $MINIMUM_FARE);

        if ($isStudent) {
            $fare *= $STUDENT_DISCOUNT;
        }

        $fare = round($fare, 2);

        echo json_encode([
            'distance_km' => $distance,
            'fare' => $fare
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function calculateDistance($startLocation, $endLocation, $apiKey) {
    $url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=$startLocation&destinations=$endLocation&key=$apiKey";

    $response = file_get_contents($url);
    $responseJson = json_decode($response, true);

    if ($responseJson['status'] !== 'OK') {
        return null;
    }

    $distanceInMeters = $responseJson['rows'][0]['elements'][0]['distance']['value'] ?? null;

    if ($distanceInMeters === null) {
        return null;
    }

    return $distanceInMeters / 1000; // Convert meters to kilometers
}
?>
