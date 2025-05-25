function showOverlayImages(element) {
    var overlay = element.querySelector(".overlayImages");

    if (overlay.style.display == "flex") {
        overlay.style.display = "none";
    } else {
        overlay.style.display = "flex";
    }
}

function showOverlayVideos(element) {
    var overlay = element.querySelector(".overlayVideos");

    if (overlay.style.display == "flex") {
        overlay.style.display = "none";
    } else {
        overlay.style.display = "flex";
    }
}
