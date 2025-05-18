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

                        var a = showBlock.querySelector(`#${field}`);

                        if (dbStruct[field].type == "file") {
                            a.setAttribute("src", e[field]);
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
