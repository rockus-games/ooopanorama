<?php
    include 'login.php';
    function guidv4($data = null) {
        $data = $data ?? random_bytes(16);
        assert(strlen($data) == 16);

        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }


    $bytes = file_get_contents($_FILES['file']['tmp_name']);
    $name = $_FILES['file']['tmp_name'];

    $target = "../loadedFiles/".guidv4();
    echo $target;

    if (!file_exists('../loadedFiles/')) {
        mkdir('../loadedFiles/', 0777, true);
    }

    move_uploaded_file($_FILES['file']['tmp_name'], $target);

?>