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

            data.forEach((e) => {
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
                            if (e[field] == "") {
                                return;
                            }
                            a.setAttribute("src", e[field]);

                            if (field == "video") {
                                if (
                                    showBlock.querySelector(
                                        `#${table}_${id}_videoButton`
                                    ) != null
                                ) {
                                    showBlock.querySelector(
                                        `#${table}_${id}_videoButton`
                                    ).style.display = "flex";
                                }
                            }
                        } else if (dbStruct[field].type == "array_of_images") {
                            if (e[field] == "") {
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
