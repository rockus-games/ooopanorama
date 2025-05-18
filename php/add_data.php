<?php
    include 'login.php';

    $keys = $_POST["keys"];
    $data = $_POST["data"];
    $table = $_POST["table"];

    $conn = new mysqli("localhost:3306", "cb07184_panorama", "9BWv5j430", "cb07184_panorama");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $fields = "";
    $values = "";

    foreach ($keys as $k) {
        $fields = $fields."$k,";
        $values = $values."'$data[$k]',";
    }

    $fields = rtrim($fields, ",");
    $values = rtrim($values, ",");


    $query = "INSERT INTO $table ($fields) VALUES($values);";

    echo $query;
    $data = $conn->query($query);

    if($data === TRUE) {
        echo "Added";
        exit();
    }

    die("No users found");
?>