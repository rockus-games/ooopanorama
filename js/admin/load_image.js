function loadImage(id) {
    var imgPicker = document.querySelector(id);

    var file = imgPicker.files[0];

    console.log(file.name);

    var data = new FormData();
    data.append("file", file);

    $.ajax({
        url: "/php/load_image.php",
        method: "POST",
        data: data,
        processData: false,
        contentType: false,
        success: (uploadedFile) => {
            uploadedFile;
        },
    });
}
