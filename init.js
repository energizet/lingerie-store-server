import fs from 'fs';

copyFile('default', 'api', 'products.json');

let dir = fs.opendirSync(new URL('default/img', import.meta.url));
for (let file = dir.readSync(); file; file = dir.readSync()) {
    copyFile('default/img', 'wwwroot/img/', file.name);
}

dir.closeSync()

function copyFile(fromDir, toDir, fileName) {
    let fromDirUrl = new URL(fromDir, import.meta.url);
    let toDirUrl = new URL(toDir, import.meta.url);
    if (fs.existsSync(toDirUrl) === false) {
        fs.mkdirSync(toDirUrl);
    }

    let fileDs = fs.openSync(new URL(`${toDirUrl}/${fileName}`), 'w');
    fs.writeSync(fileDs, fs.readFileSync(new URL(`${fromDirUrl}/${fileName}`)));
    fs.closeSync(fileDs);
}