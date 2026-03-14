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
                () => {
                    location.reload();
                },
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
            () => {
                location.reload();
            },
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
        if (previewBlock.children[0]) {
            previewBlock.children[0].id = "previewDiv";
        }
    });
}

function changeText() {
    var element = document.querySelector("#previewDiv");
    if (!element) {
        return;
    }

    var target = element.querySelector(`[data-field="${this.dataset.field}"]`);
    if (!target) {
        return;
    }

    if (this.value != "") {
        target.textContent = this.value;
    } else {
        target.textContent =
            this.dataset.field == "text_3" ? "" : this.placeholder;
    }
}

function pickFile(btn) {
    var input = document.createElement("input");
    input.type = "file";

    input.onchange = async () => {
        var a = await loadImage(input);
        var element = document.querySelector("#previewDiv");
        if (!element) {
            return;
        }

        var value = a.substring(1);
        btn.setAttribute("value", value);

        if (btn.dataset.field === "video") {
            var videoContainer = element.querySelector('[data-field="video"]');
            if (!videoContainer) {
                return;
            }

            var source = videoContainer.querySelector("source");
            if (source) {
                source.src = value;
            }
            videoContainer.style.display = "";
            return;
        }

        var target = element.querySelector(
            `[data-field="${btn.dataset.field}"]`,
        );
        if (target && target.tagName === "IMG") {
            target.setAttribute("src", value);
            target.style.display = "";
        }
    };

    input.click();
}

function resolvePreviewArrayTarget(element, field) {
    var target = element.querySelector(`[data-field="${field}"]`);
    if (target) {
        return target;
    }

    if (field === "images") {
        return element.querySelector('[data-field="image"]');
    }

    if (field === "image") {
        return element.querySelector('[data-field="images"]');
    }

    if (field === "photos") {
        return element.querySelector('[data-field="photo"]');
    }

    if (field === "photo") {
        return element.querySelector('[data-field="photos"]');
    }

    return null;
}

function renderPreviewArrayImages(target, files) {
    var firstImage = files[0] || "";

    if (target.tagName === "IMG") {
        if (firstImage) {
            target.setAttribute("src", firstImage);
            target.style.display = "";
        } else {
            target.style.display = "none";
        }
        return;
    }

    target.innerHTML = "";
    if (!firstImage) {
        return;
    }

    var imageClass =
        target.dataset.field === "photos" || target.dataset.field === "photo"
            ? "review-card__photo"
            : "price-card__image";

    files.forEach((src) => {
        var img = document.createElement("img");
        img.className = imageClass;
        img.src = src;
        img.alt = "";
        target.appendChild(img);
    });
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
        if (!element) {
            return;
        }

        btn.setAttribute("value", JSON.stringify(a));

        var target = resolvePreviewArrayTarget(element, btn.dataset.field);
        if (target) {
            renderPreviewArrayImages(target, a);
        }
    };

    input.click();
}
