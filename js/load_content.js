function loadElements(block, table) {
    var showBlock = document.querySelector(block);

    $.ajax({
        url: "/php/get_data.php",
        method: "POST",
        data: { table: table },
        success: async (data) => {
            data = JSON.parse(data);

            if (data.length == 0) {
                return;
            }

            showBlock.innerHTML = "";

            var dbStruct = await getDBStructure(table);

            var id = -1;

            data.forEach((e, index) => {
                $.get(`/elements/${table}.html`, (code) => {
                    showBlock.insertAdjacentHTML("beforeend", code);

                    Object.keys(e).forEach((field) => {
                        if (field == "id") {
                            id = e[field];

                            if (
                                showBlock.querySelector("#videoButton") != null
                            ) {
                                showBlock.querySelector(
                                    "#videoButton"
                                ).id = `${table}_${id}_videoButton`;
                            }
                            if (
                                showBlock.querySelector("#imageButton") != null
                            ) {
                                showBlock.querySelector(
                                    "#imageButton"
                                ).id = `${table}_${id}_imageButton`;
                            }
                            return;
                        }

                        if (!Object.keys(dbStruct).includes(field)) {
                            return;
                        }

                        var a = showBlock.querySelector(`#${field}`);

                        if (dbStruct[field].type == "file") {
                            var hor =
                                showBlock.querySelectorAll(
                                    ".horizontalActions"
                                )[index];

                            if (e[field] == "") {
                                a.id = `${table}_${id}_${field}`;

                                if (field == "video") {
                                    if (a.parentNode.style.display == "") {
                                        a.parentNode.style.display = "none";
                                    }

                                    if (a.style.display == "") {
                                        a.style.display = "none";
                                    }

                                    if (
                                        hor != null &&
                                        hor.style.display == ""
                                    ) {
                                        hor.style.display = "none";
                                    }
                                }

                                return;
                            }
                            if (a.parentNode.classList.contains("content")) {
                                a.parentNode.style.display = "flex";
                            }
                            a.setAttribute("src", e[field]);

                            if (hor != null) {
                                hor.style.display = "flex";
                            }

                            // console.log(`${field} ${id} - ${a.src}`);
                        } else if (dbStruct[field].type == "array_of_images") {
                            var hor =
                                showBlock.querySelectorAll(
                                    ".horizontalActions"
                                )[index];

                            if (e[field] == "") {
                                a.id = `${table}_${id}_${field}`;

                                if (a.style.display == "") {
                                    a.style.display = "none";
                                }

                                if (hor != null && hor.style.display == "") {
                                    hor.style.display = "none";
                                }

                                return;
                            }
                            var b = JSON.parse(e[field]);

                            a.style.display = "flex";
                            if (hor != null) {
                                hor.style.display = "flex";
                            }

                            for (var i = 0; i < b.length; i++) {
                                var img = document.createElement("img");
                                img.src = b[i];

                                if (block.includes("Reviews")) {
                                    img.classList = "image";
                                } else {
                                    if (i == 0) {
                                        img.classList = "image viewing";
                                    } else {
                                        img.classList = "image hidden";
                                    }
                                }

                                a.appendChild(img);
                            }

                            if (
                                showBlock.querySelector(
                                    `#${table}_${id}_imageButton`
                                ) != null
                            ) {
                                showBlock.querySelector(
                                    `#${table}_${id}_imageButton`
                                ).style.display = "flex";
                            }
                        } else {
                            a.innerHTML = e[field];
                        }

                        a.id = `${table}_${id}_${field}`;
                    });
                });
            });

            setTimeout(() => {
                setSize();
                videoSetSize();
            }, 1000);
        },
    });
}
