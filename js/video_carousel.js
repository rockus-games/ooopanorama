var videoCarousels = document.querySelectorAll(".videoCarouselBody");

function videoSetSize() {
    videoCarousels.forEach((carousel) => {
        var cards = carousel.children;
        if (cards.length > 1) {
            cards[0].classList.add("first");
        }
        if (cards.length > 1) {
            cards[cards.length - 1].classList.add("last");
        }

        if (cards.length != 0) {
            cards[0].classList.add("selected");
        }
    });
}

document.querySelectorAll(".videoCarousel").forEach((carousel) => {
    var body = carousel.children[0];
    var cards = body.children;
    var parentWidth = body.getBoundingClientRect().width;
    var selected = 0;

    var left = document.createElement("div");
    left.classList.add("carouselButton", "previous");
    left.innerHTML = `<img src="images/next.svg" />`;
    left.onclick = () => {
        cards[selected].classList.remove("selected");
        selected = selected - 1 < 0 ? 0 : selected - 1;
        cards[selected].classList.add("selected");

        if (selected != cards.length - 1) {
            var scroll = 0;

            for (var j = 0; j < selected; j++) {
                scroll += cards[j].getBoundingClientRect().width;
            }

            body.scrollTo({
                top: 0,
                left: scroll,
                behavior: "smooth",
            });
        }
    };

    var right = document.createElement("div");
    right.classList.add("carouselButton");
    right.innerHTML = `<img src="images/next.svg" />`;
    right.onclick = () => {
        cards[selected].classList.remove("selected");
        selected =
            selected + 1 > cards.length - 1 ? cards.length - 1 : selected + 1;
        cards[selected].classList.add("selected");

        if (selected != 0) {
            var scroll = 0;

            for (var j = 0; j < selected; j++) {
                scroll += cards[j].getBoundingClientRect().width;
            }
            body.scrollTo({
                top: 0,
                left: scroll,
                behavior: "smooth",
            });
        }
    };

    carousel.prepend(left);
    carousel.append(right);
});

videoSetSize();
