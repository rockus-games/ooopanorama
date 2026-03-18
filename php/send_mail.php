<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    
    require 'phpmailer/src/Exception.php';
    require 'phpmailer/src/PHPMailer.php';
    require 'phpmailer/src/SMTP.php';

    $email = isset($_POST["email"]) ? trim($_POST["email"]) : "";
    $name = isset($_POST["name"]) ? trim($_POST["name"]) : "";
    $phone = isset($_POST["phone"]) ? trim($_POST["phone"]) : "";
    $msg = isset($_POST["msg"]) ? trim($_POST["msg"]) : "";
    
    
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = "smtp.timeweb.ru";
    $mail->Port = 465;
    $mail->SMTPAuth = true;
    $mail->SMTPDebug = 0;
    $mail->Username = 'info@ooopanorama.ru';
    $mail->Password = '9BWv5j430';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->CharSet = "utf-8";

    $mail->setFrom('info@ooopanorama.ru', 'ООО Панорама');
    $mail->addAddress('okno7373@mail.ru', 'Копии заявок');
    $mail->addAddress('service@ooopanorama.ru', 'Новая заявка');
    $mail->Subject = 'Запрос на сайте ООО Панорама';
    

    $body = "<p>Поступила новая заявка на сайте ООО Панорама</p>"
        . "<p><strong>Имя:</strong> $name</p>"
        . "<p><strong>Телефон:</strong> $phone</p>"
        . "<p><strong>Email:</strong> $email</p>"
        . "<p><strong>Сообщение:</strong> $msg</p>";
    $mail->msgHTML($body);
    
    
    header('Content-Type: application/json');
    try {
        $mail->send();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
    }
?>
