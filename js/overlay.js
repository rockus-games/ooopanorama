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

function nextImage(parent) {
    let images = parent
        .querySelector(".imageContainer")
        .querySelectorAll(".image");

    let index = -1;

    for (var i = 0; i < images.length; i++) {
        if (images[i].classList.contains("viewing")) {
            index = i;
            break;
        }
    }

    if (index + 1 < images.length) {
        images[index].classList = "image hidden";
        images[index + 1].classList = "image viewing";
    }
}

function prevImage(parent) {
    let images = parent
        .querySelector(".imageContainer")
        .querySelectorAll(".image");

    let index = -1;

    for (var i = 0; i < images.length; i++) {
        if (images[i].classList.contains("viewing")) {
            index = i;
            break;
        }
    }

    if (index - 1 >= 0) {
        images[index].classList = "image hidden";
        images[index - 1].classList = "image viewing";
    }
}
