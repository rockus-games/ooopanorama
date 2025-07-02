function isMobile() {
    var width = window.innerWidth > 0 ? window.innerWidth : screen.width;

    // const regex =
    //     /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    // return regex.test(navigator.userAgent);

    return width <= 500;
}

function toggleSideMenu() {
    var menu = document.querySelector("#mobileNavMenu");

    if (menu.className == "mobileNavMenuClosed") {
        menu.className = "mobileNavMenuOpened";
    } else {
        menu.className = "mobileNavMenuClosed";
    }
}
