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
                            return;
                        }

                        if (dbStruct[field].type == "file") {
                            element
                                .querySelector(`#${field}`)
                                .setAttribute("src", e[field]);
                        } else if (dbStruct[field].type == "array_of_images") {
                            if (e[field] == "") {
                                return;
                            }
                            var a = JSON.parse(e[field]);
                            console.log(a);

                            for (var i = 0; i < a.length; i++) {
                                var img = document.createElement("img");
                                img.src = a[i];
                                element
                                    .querySelector(`#${field}`)
                                    .appendChild(img);
                            }
                            element.querySelector(
                                "#imageButton"
                            ).style.display = "initial";
                        } else {
                            element.querySelector(`#${field}`).innerHTML =
                                e[field];

                            if (element.querySelector("#videoButton") != null) {
                                element.querySelector(
                                    "#videoButton"
                                ).style.display = "initial";
                            }
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
                                previewDiv
                                    .querySelector(`#${field}`)
                                    .setAttribute("src", e[field]);
                                addBlock.querySelector(
                                    `[data-field="${field}"]`
                                ).value = e[field];
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
