function login(user, password) {
    $.post(
        "/php/login.php",
        {
            login: "1",
            password: "1",
        },
        (data, status, _) => {
            console.log(data);
        }
    );
}
