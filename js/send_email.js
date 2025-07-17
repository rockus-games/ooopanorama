function sendEmail(name, email, phone, msg) {
    $.ajax({
        url: "/php/send_mail.php",
        method: "POST",
        data: {
            name: name,
            email: email,
            phone: phone,
            msg: msg,
        },
        success: (data) => {
            console.log(data);
            location.reload();
        },
    });
}

function askSendButton() {
    console.log(document.querySelector(".askSendCheckBox").checked);
    if (document.querySelector(".askSendCheckBox").checked == true) {
        sendEmail(
            document.querySelector("#askUserFieldName").value,
            "",
            document.querySelector("#askUserFieldPhone").value,
            "Перезвоните, у меня есть вопросы"
        );
    }
}

function callSendButton() {
    grecaptcha.ready(function () {
        grecaptcha
            .execute("6LflsYYrAAAAALTOxkCbPOIvVh6NZaxYpCMm6R3V", {
                action: "submit",
            })
            .then(function (token) {
                $.ajax({
                    url: "/php/captcha.php",
                    method: "POST",
                    data: {
                        token: token,
                    },
                    success: (data) => {
                        if (
                            (data["success"] == "true" ||
                                data["success"] == true) &&
                            data["om_score"] > 0.5
                        ) {
                            sendEmail(
                                document.querySelector("#askUserFieldName")
                                    .value,
                                "",
                                document.querySelector("#askUserFieldPhone")
                                    .value,
                                "Заявка на вызов замерщика"
                            );
                        }
                        //location.reload();
                    },
                });
            });
    });

    toggleModal();
}

function orderCountSend() {
    sendEmail(
        "",
        "",
        document.querySelector("#orderCountNumber").value,
        document.querySelector("#orderCountText").value
    );
}

function orderCallSend() {
    sendEmail(
        document.querySelector("#orderCallName").value,
        "",
        document.querySelector("#orderCallPhone").value,
        "Перезвоните, пожалуйста, у меня есть вопросы"
    );
}
