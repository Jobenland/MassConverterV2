const colors = require("colors")
const figures = require('figures')
const replaceExt = require("replace-ext")
const decompress = require("decompress")
const path = require("path")
const fs = require("fs")

function manipulateFiles(initialPath, _callback){
    fs.readdir(initialPath, (err, files) => {
        if (err) {
            console.log(figures.cross.red,"Error! Path does not exist. Enter a valid path".red)
        } else {
            foldersCreated = []
            let filesChecked = 0
            files.forEach(file => {
                filesChecked++
                if (path.extname(file) == ".mdat") {
                    let newPath = replaceExt(`${initialPath}\\${file}`, '.zip');
                    fs.rename(`${initialPath}\\${file}`, newPath, function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                    });
                    decompress(newPath, `${initialPath}\\${file.replace(/\.[^/.]+$/, "")}`).then(decompressedFiles => {
                        foldersCreated.push(`${initialPath}\\${file.replace(/\.[^/.]+$/, "")}`)
                        if (filesChecked === files.length) {
                            _callback(foldersCreated)
                        }
                    });
                }
            });
        }
    })
}

module.exports = { manipulateFiles }