var coldBtn = document.querySelector(".balconyColdBtn");
var warmBtn = document.querySelector(".balconyWarmBtn");
var coldTxt = document.querySelector(".balconyColdPrice");
var warmTxt = document.querySelector(".balconyWarmPrice");
var div = document.querySelector(".balconyImg");
var img = div.querySelector("img");

var isMob = isMobile();

function changeWarmCold(cold) {
    if (cold == true) {
        if (coldBtn.classList.contains("selectedBalconyBtn")) {
            return;
        }
        coldBtn.classList.add("selectedBalconyBtn");
        warmBtn.classList.remove("selectedBalconyBtn");
        if (isMob) {
            div.style.backgroundImage =
                'url("/images/balcony/balconyColdMob.png")';
        } else {
            div.style.backgroundImage =
                'url("/images/balcony/balconyCold.png")';
        }
        img.src = "/images/balcony/cold-glazing.png";
        warmTxt.style.display = "none";
        coldTxt.style.display = "initial";
    } else {
        if (warmBtn.classList.contains("selectedBalconyBtn")) {
            return;
        }
        warmBtn.classList.add("selectedBalconyBtn");
        coldBtn.classList.remove("selectedBalconyBtn");
        if (isMob) {
            div.style.backgroundImage =
                'url("/images/balcony/balconyWarmMob.png")';
        } else {
            div.style.backgroundImage =
                'url("/images/balcony/balconyWarm.png")';
        }
        img.src = "/images/balcony/warm-glazing.png";
        coldTxt.style.display = "none";
        warmTxt.style.display = "initial";
    }
}
