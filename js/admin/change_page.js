function changePage(page) {
    var params = new URLSearchParams(location.search);

    if (params.get("block") != null) {
        params.delete("block");
    }

    params.set("page", page);
    window.location.search = params.toString();
}

function changeBlock(block) {
    var params = new URLSearchParams(location.search);

    if (params.get("block") != block) {
        params.set("block", block);
        window.location.search = params.toString();
    }

    prepareAddNew(block);
    loadElements(block);
}

var params = new URLSearchParams(location.search);

if (params.get("block") != null) {
    changeBlock(params.get("block"));
}

if (params.get("page") != null) {
    var page = params.get("page");

    $.getJSON("/json/pages.json", {}, (data) => {
        document.querySelector("#pageTitle").innerHTML = data[page].name;

        var blocks = document.querySelector(".blocks");

        data[page].buttons.forEach((btn) => {
            var e = document.createElement("button");
            e.onclick = () => {
                changeBlock(btn.name);
            };
            e.innerHTML = btn.label;

            blocks.appendChild(e);
        });
    });
}
