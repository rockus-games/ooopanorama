function loadElements(table) {
    var showBlock = document.querySelector("#showBlock");

    $.ajax({
        url: "/php/get_data.php",
        method: "POST",
        data: { table: table },
        success: async (data) => {
            data = JSON.parse(data);

            if (data.length == 0) {
                showBlock.innerHTML = "Элементов нет";
                return;
            }

            showBlock.innerHTML = "";

            var dbStruct = await getDBStructure(table);

            data.forEach((e) => {
                var element = document.createElement("div");
                element.className = "createdElement";

                $.get(`/elements/${table}.html`, (code) => {
                    element.innerHTML = code;

                    Object.keys(e).forEach((field) => {
                        if (field == "id") {
                            element.setAttribute("data-id", e[field]);
                            return;
                        }

                        if (!Object.keys(dbStruct).includes(field)) {
                            console.log(e[field]);
                            return;
                        }

                        if (dbStruct[field].type == "file") {
                            if (e[field] == "") {
                                return;
                            }
                            element
                                .querySelector(`#${field}`)
                                .setAttribute("src", e[field]);

                            if (field == "video") {
                                if (
                                    element.querySelector("#videoButton") !=
                                    null
                                ) {
                                    element.querySelector(
                                        "#videoButton"
                                    ).style.display = "initial";
                                }
                            }
                        } else if (dbStruct[field].type == "array_of_images") {
                            if (e[field] == "") {
                                return;
                            }
                            var a = JSON.parse(e[field]);
                            console.log(e[field]);

                            for (var i = 0; i < a.length; i++) {
                                var img = document.createElement("img");
                                img.src = a[i];

                                if (i == 0) {
                                    img.classList = "image viewing";
                                } else {
                                    img.classList = "image hidden";
                                }

                                element
                                    .querySelector(`#${field}`)
                                    .appendChild(img);
                            }

                            if (element.querySelector("#imageButton") == null) {
                                return;
                            }

                            element.querySelector(
                                "#imageButton"
                            ).style.display = "initial";
                        } else {
                            element.querySelector(`#${field}`).innerHTML =
                                e[field];
                        }
                    });

                    var hoverMenu = document.createElement("div");
                    hoverMenu.className = "hoverMenu";

                    var editButton = document.createElement("button");
                    editButton.innerHTML = "Редактировать";
                    editButton.onclick = () => {
                        var addBlock = document.querySelector("#addBlock");
                        var previewDiv = document.querySelector("#previewDiv");

                        Object.keys(e).forEach((field) => {
                            if (field == "id") {
                                addBlock.setAttribute("data-id", e[field]);
                                return;
                            }

                            if (dbStruct[field].type == "file") {
                                if (e[field] == "") {
                                    if (field == "video") {
                                        if (
                                            previewDiv.querySelector(
                                                "#videoButton"
                                            ) != null
                                        ) {
                                            previewDiv.querySelector(
                                                "#videoButton"
                                            ).style.display = "none";
                                        }
                                    }
                                    if (field == "avatar") {
                                        previewDiv
                                            .querySelector(`#${field}`)
                                            .setAttribute(
                                                "src",
                                                "/images/icons/person.png"
                                            );
                                    } else {
                                        previewDiv
                                            .querySelector(`#${field}`)
                                            .setAttribute("src", "");
                                    }
                                    return;
                                }
                                previewDiv
                                    .querySelector(`#${field}`)
                                    .setAttribute("src", e[field]);
                                addBlock.querySelector(
                                    `[data-field="${field}"]`
                                ).value = e[field];

                                if (field == "video") {
                                    if (
                                        previewDiv.querySelector(
                                            "#videoButton"
                                        ) != null
                                    ) {
                                        previewDiv.querySelector(
                                            "#videoButton"
                                        ).style.display = "initial";
                                    }
                                }
                            } else if (
                                dbStruct[field].type == "array_of_images"
                            ) {
                                var a = previewDiv.querySelector(`#${field}`);
                                if (e[field] == "") {
                                    if (
                                        previewDiv.querySelector(
                                            "#imageButton"
                                        ) != null
                                    ) {
                                        previewDiv.querySelector(
                                            "#imageButton"
                                        ).style.display = "";
                                    }
                                    a.innerHTML = "";
                                    return;
                                }
                                var b = JSON.parse(e[field]);

                                for (var i = 0; i < b.length; i++) {
                                    var img = document.createElement("img");
                                    img.src = b[i];
                                    if (i == 0) {
                                        img.classList = "image viewing";
                                    } else {
                                        img.classList = "image hidden";
                                    }

                                    a.appendChild(img);
                                }

                                if (
                                    previewDiv.querySelector("#imageButton") !=
                                    null
                                ) {
                                    previewDiv.querySelector(
                                        "#imageButton"
                                    ).style.display = "initial";
                                }
                            } else {
                                previewDiv.querySelector(
                                    `#${field}`
                                ).innerHTML = e[field];
                                addBlock.querySelector(
                                    `[data-field="${field}"]`
                                ).value = e[field];
                            }
                        });
                    };

                    var deleteButton = document.createElement("button");
                    deleteButton.innerHTML = "Удалить";
                    deleteButton.onclick = () => {
                        $.ajax({
                            url: "/php/delete_data.php",
                            method: "POST",
                            data: {
                                table: table,
                                id: element.dataset.id,
                                login: sessionStorage.getItem("login"),
                                password: sessionStorage.getItem("password"),
                            },
                            success: (data) => {
                                location.reload();
                            },
                        });
                    };

                    hoverMenu.appendChild(editButton);
                    hoverMenu.appendChild(deleteButton);

                    element.appendChild(hoverMenu);
                });

                element.addEventListener("mouseenter", (event) => {
                    var hover = event.target.querySelector(".hoverMenu");
                    hover.style.display = "flex";
                });

                element.addEventListener("mouseleave", (event) => {
                    var hover = event.target.querySelector(".hoverMenu");
                    hover.style.display = "none";
                });

                showBlock.appendChild(element);
            });
        },
    });
}
