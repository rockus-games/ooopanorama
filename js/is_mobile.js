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
    const overlay = document.querySelector("#mobileNavOverlay");
    if (!menu) return;

    const isOpening = menu.classList.contains("mobileNavMenuClosed");

    menu.classList.toggle("mobileNavMenuOpened", isOpening);
    menu.classList.toggle("mobileNavMenuClosed", !isOpening);

    if (overlay) {
        overlay.classList.toggle("mobileNavOverlayShown", isOpening);
        overlay.classList.toggle("mobileNavOverlayHidden", !isOpening);
    }
}
