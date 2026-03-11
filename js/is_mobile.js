const breakpoints = {
    mobile: 576,
    tablet: 768,
    desktop: 992,
};

function isMobile() {
    return window.matchMedia(`(max-width: ${breakpoints.mobile}px)`).matches;
}

function toggleSideMenu() {
    const menu = document.querySelector("#mobileNavMenu");
    if (!menu) return;

    menu.classList.toggle("mobileNavMenuOpened");
    menu.classList.toggle("mobileNavMenuClosed");
}
