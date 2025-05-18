<?php
    $login = $_POST["login"];
    $password = $_POST["password"];

    $conn = new mysqli("localhost:3306", "cb07184_panorama", "9BWv5j430", "cb07184_panorama");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $query = "SELECT * FROM users WHERE login = '$login'";
    $data = $conn->query($query);

    if($data->num_rows > 0) {
        while($row = $data->fetch_assoc()) {
            if($row["password"] == md5($password)) {
                echo json_encode($row);
                $conn->close();
                exit();
            }
        }
    }

    die("No users found");
?>