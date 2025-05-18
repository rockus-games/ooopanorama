<?php
    use PHPMailer\PHPMailer\PHPMailer;
    
    require 'phpmailer/src/Exception.php';
    require 'phpmailer/src/PHPMailer.php';
    require 'phpmailer/src/SMTP.php';

    $email = $_POST["email"];
    $name = $_POST["name"];
    $phone = $_POST["phone"];
    $msg = $_POST["msg"];
    
    
    $mail = new PHPMailer;
    $mail->isSMTP();
    $mail->Host = "ssl://smtp.timeweb.ru";
    $mail->Port = 465;
    $mail->SMTPAuth = true;
    $mail->SMTPDebug = 0;
    $mail->Username = 'info@ooopanorama.ru';
    $mail->Password = '9BWv5j430';
    $mail->SMTPSecure = 'ssl';
    $mail->CharSet = "utf-8";

    $mail->setFrom('info@ooopanorama.ru', 'ООО Панорама');
    $mail->addAddress('okno7373@mail.ru', 'Копии заявок');
    $mail->addAddress('service@ooopanorama.ru', 'Новая заявка');
    $mail->Subject = 'Запрос на сайте ООО Панорама';
    

    $body = "<p>Поступила новая заявка на сайте ООО Панорама</p><p>От: $name $phone $email</p><p>$msg</p>";
    $mail->msgHTML($body);
    
    
    $mail->send();
?>
