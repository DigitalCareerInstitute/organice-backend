const fs = require("fs");

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function createRecursiveFolderPath(path) {
    var folders = path.split("/").filter(item => item !== "" && item !== ".")

    var str = "./";
    folders.map(directory => {
        str += directory + "/";
        if (!fs.existsSync(str)) {
            fs.mkdirSync(str);
        }
    })
}
module.exports = { isJsonString, createRecursiveFolderPath }
