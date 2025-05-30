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
                            return;
                        }

                        if (!Object.keys(dbStruct).includes(field)) {
                            return;
                        }

                        var a = showBlock.querySelector(`#${field}`);

                        if (dbStruct[field].type == "file") {
                            a.setAttribute("src", e[field]);
                            if (
                                showBlock.querySelector("#videoButton") != null
                            ) {
                                showBlock.querySelector(
                                    "#videoButton"
                                ).style.display = "initial";
                                showBlock.querySelector(
                                    "#videoButton"
                                ).id = `${table}_${id}_videoButton`;
                            }
                        } else if (dbStruct[field].type == "array_of_images") {
                            var b = JSON.parse(e[field]);

                            for (var i = 0; i < b.length; i++) {
                                var img = document.createElement("img");
                                img.src = b[i];
                                a.appendChild(img);
                            }

                            showBlock.querySelector(
                                "#imageButton"
                            ).style.display = "initial";
                            showBlock.querySelector(
                                "#imageButton"
                            ).id = `${table}_${id}_imageButton`;
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
