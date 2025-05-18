async function prepareAddNew(table) {
    var dbStruct = await getDBStructure(table);

    var addBlock = document.querySelector(".addBlock");

    var elements = [];

    Object.keys(dbStruct).forEach((key) => {
        var e = document.createElement("input");
        e.setAttribute("placeholder", dbStruct[key].label);
        elements.push(e);
    });

    addBlock.innerHTML = "";

    elements.forEach((e) => {
        addBlock.appendChild(e);
    });
}
