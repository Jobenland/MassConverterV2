const colors = require("colors")
const replaceExt = require("replace-ext")
const decompress = require("decompress")
const path = require("path")
const fs = require("fs")

function manipulateFiles(initialPath){
    fs.readdir(initialPath, (err, files) => {
        if (err) {
            console.log(err)
            console.log("Error! Path does not exist. Enter a valid path".red)
        } else {
            console.log(`Successfully initialized working directory at ${initialPath}`.green)
            files.forEach(file => {
                if (path.extname(file) == ".mdat") {
                    console.log("located MDAT file...")
                    let newPath = replaceExt(`${initialPath}\\${file}`, '.zip');
                    fs.rename(`${initialPath}\\${file}`, newPath, function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                    });
                    decompress(newPath, `${initialPath}\\${file.replace(/\.[^/.]+$/, "")}`).then(files => {
                        console.log("Converted MDAT file to ZIP and decompressed");
                    });
                }
        });
        }
    })
}

module.exports = { manipulateFiles }