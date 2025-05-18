<?php
    include 'login.php';
    
    $keys = $_POST["keys"];
    $data = $_POST["data"];
    $table = $_POST["table"];
    $id = $_POST["id"];

    $conn = new mysqli("localhost:3306", "cb07184_panorama", "9BWv5j430", "cb07184_panorama");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $fields = "";

    foreach ($keys as $k) {
        $fields = $fields."$k = '$data[$k]',";
    }

    $fields = rtrim($fields, ",");


    $query = "UPDATE $table SET $fields WHERE id = $id;";

    echo $query;
    $data = $conn->query($query);

    if($data === TRUE) {
        echo "Added";
        exit();
    }

    die("No users found");
?>