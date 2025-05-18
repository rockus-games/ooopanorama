function login() {
    var user = document.querySelector("#loginField").value;
    var password = document.querySelector("#passwordField").value;

    $.post(
        "/php/loginJS.php",
        {
            login: user,
            password: password,
        },
        (data, status, _) => {
            // console.log(data);
            if (data != "error") {
                sessionStorage.setItem("login", user);
                sessionStorage.setItem("password", password);
                location.reload();
            }
        }
    );
}

function logOut() {
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("password");
    location.reload();
}

if (sessionStorage.getItem("login") == null) {
    document.querySelector("#loginDiv").style.display = "flex";
    document.querySelector("#main").style.display = "none";
} else {
    document.querySelector("#loginDiv").style.display = "none";
    document.querySelector("#main").style.display = "initial";
}
