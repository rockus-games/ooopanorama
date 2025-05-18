<?php
    $table = $_POST["table"];

    $conn = new mysqli("92.53.96.223:3306", "cb07184_panorama", "9BWv5j430", "cb07184_panorama");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $query = "SELECT * FROM $table";

    $data = $conn->query($query);

    $result = [];

    if ($data->num_rows > 0) {
        while($row = $data->fetch_assoc()) {
            $result[] = $row;
        }
    }

    echo json_encode($result);
    $conn->close();
?>