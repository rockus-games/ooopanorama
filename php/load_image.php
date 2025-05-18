<?php
    $bytes = file_get_contents($_FILES['file']['tmp_name']);
    $name = $_FILES['file']['name'];

    $target = "../loadedFiles/$name";
    echo $target;

    move_uploaded_file($_FILES['file']['tmp_name'], $target);

?>