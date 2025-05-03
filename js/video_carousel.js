var videoCarousels = document.querySelectorAll(".videoCarouselBody");

function videoSetSize() {
    videoCarousels.forEach((carousel) => {
        var cards = carousel.children;
        for (var i = 0; i < cards.length; i++) {
            var parentWidth = carousel.getBoundingClientRect().width;

            cards[i].style.width = `${(parentWidth - 40) / 3}px`;
        }
        cards[0].classList.add("first");
        cards[cards.length - 1].classList.add("last");
        cards[1].classList.add("selected");
    });
}

document.querySelectorAll(".videoCarousel").forEach((carousel) => {
    var body = carousel.children[0];
    var cards = body.children;
    var parentWidth = body.getBoundingClientRect().width;
    var selected = 1;

    var left = document.createElement("div");
    left.classList.add("carouselButton", "previous");
    left.innerHTML = `<img src="/images/next.svg" />`;
    left.onclick = () => {
        cards[selected].classList.remove("selected");
        if (selected != cards.length - 1) {
            body.scrollTo({
                top: 0,
                left: body.scrollLeft - (parentWidth - subtract) / 3,
                behavior: "smooth",
            });
        }
        selected = selected - 1 < 0 ? 0 : selected - 1;
        cards[selected].classList.add("selected");
    };

    var right = document.createElement("div");
    right.classList.add("carouselButton");
    right.innerHTML = `<img src="/images/next.svg" />`;
    right.onclick = () => {
        if (selected != 0) {
            body.scrollTo({
                top: 0,
                left: body.scrollLeft + (parentWidth - subtract) / 3,
                behavior: "smooth",
            });
        }
        cards[selected].classList.remove("selected");
        selected =
            selected + 1 > cards.length - 1 ? cards.length - 1 : selected + 1;

        cards[selected].classList.add("selected");
    };

    carousel.prepend(left);
    carousel.append(right);
});

videoSetSize();

document.querySelectorAll(".test").forEach((element) => {
    element.onclick = () => {
        console.log(element.getBoundingClientRect().left);
    };
});
