function toggleModal() {
    var modal = document.querySelector(".modal");
    console.log(modal.style.display);

    if (modal.style.display == "none" || modal.style.display == "") {
        modal.style.display = "flex";
    } else {
        modal.style.display = "none";
    }
}
