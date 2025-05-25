<?php
    include 'login.php';
    include 'consts.php';

    $table = $_POST["table"];
    $id = $_POST["id"];

    $conn = new mysqli($address, "cb07184_panorama", "9BWv5j430", "cb07184_panorama");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $query = "DELETE FROM $table WHERE id = $id";

    echo $query;

    $data = $conn->query($query);

    if($data === TRUE) {
        echo "Removed";
        exit();
    }

    die("Not found");
?>