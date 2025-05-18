async function getDBStructure(table) {
    var structures = await $.getJSON("/json/db_structure.json", {});

    return structures[table];
}
