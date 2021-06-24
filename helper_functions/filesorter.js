const fs = require("fs")
const lineReader = require("line-reader")

function searchFolder(folder) {
    return new Promise(function (resolve, reject) {
        let experimentFiles = {
            path: folder,
            impedance: [],
            galvanodynamic: [],
            galvanostatic: [],
            potentiostatic: [],
            ocv: []
        }
        fs.readdir(`${folder}\\Run01`, (err, files) => {
            if (err) {
                console.log(err)
            } else {
                for (let index=0; index < files.length; index++) {
                    lineReader.eachLine(`${folder}\\Run01\\${files[index]}`, function(line, last) {
                        if (line.includes("Exp Title: ")) {
                            if (line.includes("Impedance")) {
                                experimentFiles['impedance'].push(`${folder}\\Run01\\${files[index]}`)
                            } else if (line.includes("Galvanodynamic")) {
                                experimentFiles['galvanodynamic'].push(`${folder}\\Run01\\${files[index]}`)
                            } else if (line.includes("Galvanostatic")) {
                                experimentFiles['galvanostatic'].push(`${folder}\\Run01\\${files[index]}`)
                            } else if (line.includes("Potentiostatic")) {
                                experimentFiles['potentiostatic'].push(`${folder}\\Run01\\${files[index]}`)
                            } else if (line.includes("Open Circuit")) {
                                experimentFiles['ocv'].push(`${folder}\\Run01\\${files[index]}`)
                            }
                        }
                        if (last) {
                            resolve(experimentFiles)
                        }
                    })
                }
            }
        }) 
    });
}

function sortfilesbyexperiment(folders, _callback){
    let sortDriver = async (_) => {
        let sortedFolders = {}
        foldersParsed = 0
        for (let index = 0; index < folders.length; index++) {
            await searchFolder(folders[index]).then(function(result) {
                sortedFolders[folders[index]] = result
            })
        }
        _callback(sortedFolders)
    }
    sortDriver()
}

module.exports = { sortfilesbyexperiment }