async function loadImage(element) {
    var file = element.files[0];

    console.log(file);

    var data = new FormData();
    data.append("file", file);
    data.append("login", sessionStorage.getItem("login"));
    data.append("password", sessionStorage.getItem("password"));

    var img = await $.ajax({
        url: "/php/load_image.php",
        method: "POST",
        data: data,
        processData: false,
        contentType: false,
        success: (uploadedFile) => {
            uploadedFile;
        },
    });

    return img;
}

async function loadManyImage(element) {
    var files = element.files;
    var images = [];

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        var data = new FormData();
        data.append("file", file);
        data.append("login", sessionStorage.getItem("login"));
        data.append("password", sessionStorage.getItem("password"));

        console.log(data);

        var img = await $.ajax({
            url: "/php/load_image.php",
            method: "POST",
            data: data,
            processData: false,
            contentType: false,
            success: (uploadedFile) => {
                uploadedFile;
            },
        });

        images.push(img);
    }

    return images;
}
