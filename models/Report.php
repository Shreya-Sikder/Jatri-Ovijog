<?php
class Report {
    private $conn;
    private $table_name = "reports";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    id = :id,
                    user_id = :user_id,
                    type = :type,
                    description = :description,
                    location = :location,
                    bus_company_id = :bus_company_id,
                    status = :status,
                    priority = :priority";

        $stmt = $this->conn->prepare($query);

        $data['id'] = uniqid();
        
        foreach($data as $key => $value) {
            if($key === 'location') {
                $value = json_encode($value);
            }
            $stmt->bindValue(":" . $key, $value);
        }

        return $stmt->execute();
    }

    public function getAll() {
        $query = "SELECT r.*, u.name as user_name, bc.name as bus_company_name
                FROM " . $this->table_name . " r
                LEFT JOIN users u ON r.user_id = u.id
                LEFT JOIN bus_companies bc ON r.bus_company_id = bc.id
                ORDER BY r.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}