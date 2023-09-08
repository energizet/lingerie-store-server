'use strict';

const fs = require("fs");
const path = require("path");

copyFile(path.join(__dirname, 'default'), path.join(__dirname, 'api'), 'products.json');

let fromDirPath = path.join(__dirname, 'default/img');
let toDirPath = path.join(__dirname, 'wwwroot/img/');

let dir = fs.opendirSync(fromDirPath);
let file = dir.readSync();

while (file) {
    copyFile(fromDirPath, toDirPath, file.name);

    file = dir.readSync();
}

dir.closeSync()

function copyFile(fromDir, toDir, fileName) {
    if (fs.existsSync(toDir) === false) {
        fs.mkdirSync(toDir);
    }
    let fileDs = fs.openSync(path.join(toDir, fileName), 'w');
    fs.writeSync(fileDs, fs.readFileSync(path.join(fromDir, fileName)));
    fs.closeSync(fileDs);
}