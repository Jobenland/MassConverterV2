const colors = require("colors")
const replaceExt = require("replace-ext")
const decompress = require("decompress")
const path = require("path")
const fs = require("fs")

function manipulateFiles(initialPath, _callback){
    fs.readdir(initialPath, (err, files) => {
        if (err) {
            console.log(err)
            console.log("Error! Path does not exist. Enter a valid path".red)
        } else {
            console.log(`Successfully initialized working directory at ${initialPath}`.green)
            foldersCreated = []
            let filesChecked = 0
            files.forEach(file => {
                filesChecked++
                if (path.extname(file) == ".mdat") {
                    console.log("located MDAT file...")
                    let newPath = replaceExt(`${initialPath}\\${file}`, '.zip');
                    fs.rename(`${initialPath}\\${file}`, newPath, function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                    });
                    decompress(newPath, `${initialPath}\\${file.replace(/\.[^/.]+$/, "")}`).then(decompressedFiles => {
                        console.log("Converted MDAT file to ZIP and decompressed");
                        foldersCreated.push(`${initialPath}\\${file.replace(/\.[^/.]+$/, "")}`)
                        if (filesChecked === files.length) {
                            console.log(`Generated ${foldersCreated.length} folder`)
                            _callback(foldersCreated)
                        }
                    });
                }
            });
        }
    })
}

module.exports = { manipulateFiles }