function toggleModal() {
    var modal = document.querySelector(".modal");
    console.log(modal.style.display);

    if (modal.style.display == "none" || modal.style.display == "") {
        modal.style.display = "initial";
    } else {
        modal.style.display = "none";
    }
}
