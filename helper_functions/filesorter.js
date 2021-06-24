const fs = require("fs")
const lineReader = require("line-reader")

function sortfilesbyexperiment(folders, _callback){
    let sortedFolders = {}
    foldersParsed = 0
    folders.forEach(folder => {
        foldersParsed++
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
                files.forEach(file => {
                    lineReader.eachLine(`${folder}\\Run01\\${file}`, function(line, last) {
                        if (line.includes("Exp Title: ")) {
                            if (line.includes("Impedance")) {
                                experimentFiles['impedance'].push(`${folder}\\Run01\\${file}`)
                            } else if (line.includes("Galvanodynamic")) {
                                experimentFiles['galvanodynamic'].push(`${folder}\\Run01\\${file}`)
                            } else if (line.includes("Galvanostatic")) {
                                experimentFiles['galvanostatic'].push(`${folder}\\Run01\\${file}`)
                            } else if (line.includes("Potentiostatic")) {
                                experimentFiles['potentiostatic'].push(`${folder}\\Run01\\${file}`)
                            } else if (line.includes("Open Circuit")) {
                                experimentFiles['ocv'].push(`${folder}\\Run01\\${file}`)
                            }
                        }
                        if (last) {
                            sortedFolders[folder] = experimentFiles
                            if (foldersParsed == folders.length) {
                                _callback(sortedFolders)
                            } 
                        }
                    })
                })
            }
        }) 
    })
}

module.exports = { sortfilesbyexperiment }