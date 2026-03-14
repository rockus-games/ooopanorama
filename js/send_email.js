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
        success: () => {
            window.location.href = "thanks.html";
        },
    });
}

function askSendButton() {
    if (document.querySelector(".askSendCheckBox").checked == true) {
        sendEmail(
            document.querySelector("#askUserFieldName").value,
            "",
            document.querySelector("#askUserFieldPhone").value,
            "Перезвоните, у меня есть вопросы",
        );
    }
}

function getDigitsCount(value) {
    return (value || "").replace(/\D/g, "").length;
}

function ensureErrorContainer(input) {
    if (!input) return null;

    if (input.parentElement?.classList.contains("field-with-error")) {
        return input.parentElement;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "field-with-error";

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const nextEl = wrapper.nextElementSibling;
    if (nextEl && nextEl.classList.contains("error-message")) {
        wrapper.appendChild(nextEl);
    }

    return wrapper;
}

function showError(input, message) {
    if (!input) return;

    const wrapper = ensureErrorContainer(input);
    input.classList.add("input-error");

    let errorEl = input.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains("error-message")) {
        errorEl = document.createElement("span");
        errorEl.className = "error-message";
        wrapper.appendChild(errorEl);
    }

    errorEl.textContent = message;

    requestAnimationFrame(() => {
        errorEl.classList.add("visible");
    });
}

function clearError(input) {
    if (!input) return;
    input.classList.remove("input-error");

    const errorEl = input.nextElementSibling;
    if (errorEl && errorEl.classList.contains("error-message")) {
        errorEl.classList.remove("visible");
    }
}

function validateName(nameInput) {
    const value = (nameInput?.value || "").trim();
    if (value.length < 2) {
        showError(nameInput, "Введите имя (минимум 2 символа)");
        return false;
    }
    clearError(nameInput);
    return true;
}

function validatePhone(phoneInput) {
    const value = (phoneInput?.value || "").trim();
    if (!value || getDigitsCount(value) < 10) {
        showError(phoneInput, "Введите корректный телефон (минимум 10 цифр)");
        return false;
    }
    clearError(phoneInput);
    return true;
}

function callSendButton() {
    const nameInput = document.querySelector("#askUserFieldName");
    const phoneInput = document.querySelector("#askUserFieldPhone");

    const isNameValid = validateName(nameInput);
    const isPhoneValid = validatePhone(phoneInput);

    if (!isNameValid || !isPhoneValid) {
        return;
    }

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
                                nameInput.value.trim(),
                                "",
                                phoneInput.value.trim(),
                                "Заявка на вызов замерщика",
                            );
                            toggleModal();
                        }
                    },
                });
            });
    });
}

function orderCountSend() {
    const nameInput = document.querySelector("#orderCountName");
    const phoneInput = document.querySelector("#orderCountNumber");

    const isNameValid = validateName(nameInput);
    const isPhoneValid = validatePhone(phoneInput);

    if (!isNameValid || !isPhoneValid) {
        return;
    }

    const orderTextEl = document.querySelector("#orderCountText");
    const message = orderTextEl
        ? orderTextEl.value
        : "Заявка на расчёт стоимости";

    sendEmail(nameInput.value.trim(), "", phoneInput.value.trim(), message);
}

function orderCallSend() {
    sendEmail(
        document.querySelector("#orderCallName").value,
        "",
        document.querySelector("#orderCallPhone").value,
        "Перезвоните, пожалуйста, у меня есть вопросы",
    );
}
