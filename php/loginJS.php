<?php
    include 'consts.php';
    $login = $_POST["login"];
    $password = $_POST["password"];

    $conn = new mysqli($address, "cb07184_panorama", "9BWv5j430", "cb07184_panorama");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $query = "SELECT * FROM users WHERE login = '$login'";
    $data = $conn->query($query);

    if($data->num_rows > 0) {
        while($row = $data->fetch_assoc()) {
            if($row["password"] == md5($password)) {
                $conn->close();
                exit();
            }
        }
    }
    
    $conn->close();
    die("error");
    
?>