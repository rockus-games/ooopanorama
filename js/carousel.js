const subtract = 40;

var carousels = document.querySelectorAll(".carouselBody");

function setSize() {
    carousels.forEach((carousel) => {
        var cards = carousel.children;
        for (var i = 0; i < cards.length; i++) {
            var parentWidth = carousel.getBoundingClientRect().width;

            cards[i].style.width = isMobile()
                ? "100%"
                : `${(parentWidth - 40) / 3}px`;
        }
    });
}

document.querySelectorAll(".carousel").forEach((carousel) => {
    var body = carousel.children[0];
    var parentWidth = body.getBoundingClientRect().width;

    var left = document.createElement("div");
    left.classList.add("carouselButton", "previous");
    left.innerHTML = `<img src="images/next.svg" />`;
    left.onclick = () => {
        body.scrollTo({
            top: 0,
            left: body.scrollLeft - (parentWidth - subtract) / 3,
            behavior: "smooth",
        });
    };

    var right = document.createElement("div");
    right.classList.add("carouselButton");
    right.innerHTML = `<img src="images/next.svg" />`;
    right.onclick = () => {
        body.scrollTo({
            top: 0,
            left: body.scrollLeft + (parentWidth - subtract) / 3,
            behavior: "smooth",
        });
    };

    carousel.prepend(left);
    carousel.append(right);
});

setSize();
