const colors = require("colors")
const replaceExt = require("replace-ext")
const decompress = require("decompress")
const path = require("path")
const fs = require("fs")

console.log("Mass Converter v2".yellow)
console.log("Maryland Energy Innovation Institute".blue)
let arguments = process.argv
console.log(arguments)
if (arguments.length > 2) {
    fs.readdir(process.argv[2], (err, files) => {
        if (err) {
            console.log(err)
            console.log("Error! Path does not exist. Enter a valid path".red)
        } else {
            console.log(`Successfully initialized working directory at ${process.argv[2]}`.green)
            files.forEach(file => {
                if (path.extname(file) == ".mdat") {
                    console.log("located MDAT file...")
                    let newPath = replaceExt(`${process.argv[2]}\\${file}`, '.zip');
                    fs.rename(`${process.argv[2]}\\${file}`, newPath, function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                    });
                    decompress(newPath, `${process.argv[2]}\\${file.replace(/\.[^/.]+$/, "")}`).then(files => {
                        console.log("Converted MDAT file to ZIP and decompressed");
                    });
                }
        });
        }
    })
} else {
    console.log("Error! No argument was given. (Ex. 'node index.js <filepath to mdat files>)".red)
}


