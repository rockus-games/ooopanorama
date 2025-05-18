function isMobile() {
    const regex =
        /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

function toggleSideMenu() {
    var menu = document.querySelector("#mobileNavMenu");

    if (menu.className == "mobileNavMenuClosed") {
        menu.className = "mobileNavMenuOpened";
    } else {
        menu.className = "mobileNavMenuClosed";
    }
}
