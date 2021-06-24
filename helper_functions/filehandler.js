const colors = require("colors")
const figures = require('figures')
const replaceExt = require("replace-ext")
const decompress = require("decompress")
const path = require("path")
const fs = require("fs")

function changeExtension(path, newPath) {
    return new Promise(function (resolve, reject) {
        fs.rename(path, newPath, function(err) {
            if ( err ) resolve(false);
            resolve(true)
        });
    });
}

function readDirectory(path) {
    return new Promise(function (resolve, reject) {
        fs.readdir(path, (err, files) => {
            if (err) {
                resolve(false)
            } else {
                resolve(files)
            }
        })
    });
}

function decompressZip(path, folderName) {
    return new Promise(function (resolve, reject) {
        decompress(path, folderName ).then(decompressedFiles => {
            resolve(folderName)
        });
    });
}

function manipulateFiles(initialPath, _callback){
    let fileDriver = async (_) => {
        let files = []
        let filesChecked = 0
        await readDirectory(initialPath).then(function(result) {
            files = result
        })
        let foldersCreated = []
        for (let index = 0; index < files.length; index++) {
            let file = files[index]
            console.log(files[index])
            extensionChanged = false
            filesChecked++
            if (path.extname(files[index]) == ".mdat") {
                let newPath = replaceExt(`${initialPath}\\${files[index]}`, '.zip');
                await changeExtension(`${initialPath}\\${files[index]}`, newPath).then(function (result) {
                    extensionChanged = true 
                })
                await decompressZip(newPath, `${initialPath}\\${files[index].replace(/\.[^/.]+$/, "")}`).then(function (result) {
                    console.log(result)
                    foldersCreated = foldersCreated.concat(result)
                    console.log(foldersCreated)
                })
                if (filesChecked === files.length) {
                    _callback(foldersCreated)
                }
            }
        };
    }
    fileDriver()
}

module.exports = { manipulateFiles }