<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $email;
    public $password;
    public $name;
    public $phone;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    id = :id,
                    email = :email,
                    password_hash = :password,
                    name = :name,
                    phone = :phone,
                    role = :role";

        $stmt = $this->conn->prepare($query);

        $this->id = uniqid();
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":role", $this->role);

        return $stmt->execute();
    }

    public function login($email, $password) {
        $query = "SELECT id, password_hash, role FROM " . $this->table_name . "
                WHERE email = :email LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();

        if($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if(password_verify($password, $row['password_hash'])) {
                return $row;
            }
        }

        return false;
    }
}