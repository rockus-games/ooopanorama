<?php
    include 'login.php';

    $bytes = file_get_contents($_FILES['file']['tmp_name']);
    $name = $_FILES['file']['name'];

    $target = "../loadedFiles/$name";
    echo $target;

    if (!file_exists('../loadedFiles/')) {
        mkdir('../loadedFiles/', 0777, true);
    }

    move_uploaded_file($_FILES['file']['tmp_name'], $target);

?>