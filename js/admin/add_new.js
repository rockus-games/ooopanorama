async function prepareAddNew(table) {
    var dbStruct = await getDBStructure(table);

    var addBlock = document.querySelector("#addBlock");
    var previewBlock = document.querySelector("#previewBlock");

    var elements = [];

    Object.keys(dbStruct).forEach((key) => {
        if (dbStruct[key].type == "file") {
            var e = document.createElement("button");
            e.className = "buttonForFile";
            e.innerHTML = dbStruct[key].label;
            e.setAttribute("onclick", "pickFile(this)");
            e.setAttribute("data-field", key);
        } else if (dbStruct[key].type == "array_of_images") {
            var e = document.createElement("button");
            e.className = "buttonForFile";
            e.innerHTML = dbStruct[key].label;
            e.setAttribute("onclick", "pickManyFile(this)");
            e.setAttribute("data-field", key);
        } else {
            var e = document.createElement("textarea");
            e.setAttribute("placeholder", dbStruct[key].label);
            e.setAttribute("data-field", key);
            e.setAttribute("type", dbStruct[key].type);
            e.addEventListener("input", changeText);
        }

        elements.push(e);
    });

    var submit = document.createElement("button");
    submit.onclick = () => {
        var data = {};
        var keys = [];

        elements.forEach((e) => {
            data[e.dataset.field] = e.value;
            keys.push(e.dataset.field);
        });

        if (addBlock.dataset.id != null) {
            $.post(
                "/php/edit_data.php",
                {
                    keys: keys,
                    data: data,
                    table: table,
                    id: addBlock.dataset.id,
                    login: sessionStorage.getItem("login"),
                    password: sessionStorage.getItem("password"),
                },
                (a) => {
                    console.log(a);
                    location.reload();
                }
            );
            return;
        }

        $.post(
            "/php/add_data.php",
            {
                keys: keys,
                data: data,
                table: table,
                login: sessionStorage.getItem("login"),
                password: sessionStorage.getItem("password"),
            },
            (a) => {
                console.log(a);
                location.reload();
            }
        );
    };

    submit.innerHTML = "Создать";

    addBlock.innerHTML = "";
    previewBlock.innerHTML = "";

    elements.forEach((e) => {
        addBlock.appendChild(e);
    });
    addBlock.appendChild(submit);

    $.get(`/elements/${table}.html`, (code) => {
        previewBlock.innerHTML = code;
        previewBlock.children[0].id = "previewDiv";
    });
}

function changeText() {
    var element = document.querySelector("#previewDiv");

    if (this.value != "") {
        element.querySelector(`#${this.dataset.field}`).innerHTML = this.value;
    } else {
        element.querySelector(`#${this.dataset.field}`).innerHTML =
            this.dataset.field == "text_3" ? "" : this.placeholder;
    }
}

function pickFile(btn) {
    var input = document.createElement("input");
    input.type = "file";

    input.onchange = async () => {
        var a = await loadImage(input);
        var element = document.querySelector("#previewDiv");

        btn.setAttribute("value", a.substring(1));

        element
            .querySelector(`#${btn.dataset.field}`)
            .setAttribute("src", a.substring(1));

        if (element.querySelector("#videoButton") != null) {
            element.querySelector("#videoButton").style.display = "initial";
        }
    };

    input.click();
}

function pickManyFile(btn) {
    var input = document.createElement("input");
    input.type = "file";
    input.multiple = true;

    input.onchange = async () => {
        var a = await loadManyImage(input);
        for (var i = 0; i < a.length; i++) {
            a[i] = a[i].substring(1);
        }

        var element = document.querySelector("#previewDiv");

        btn.setAttribute("value", JSON.stringify(a));

        var parent = element.querySelector(`#${btn.dataset.field}`);

        for (var i = 0; i < a.length; i++) {
            var img = document.createElement("img");
            img.src = a[i];
            parent.appendChild(img);
        }

        element.querySelector("#imageButton").style.display = "initial";
    };

    input.click();
}
