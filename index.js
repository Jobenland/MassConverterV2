const colors = require("colors")
const filehandler = require("./helper_functions/filehandler")
const filesorter = require("./helper_functions/filesorter")

//Finds the MDAT files, converts them to zip, and then extracts them to a folder with the name name as the file
//This function returns the list of folders to perform analysis on
function getFolders() {
    return new Promise(function (resolve, reject) {
        filehandler.manipulateFiles(process.argv[2], function(foldersCreated) {
            resolve(foldersCreated)
        })
    })
}

function sortFiles(folders) {
    return new Promise(function (resolve, reject) {
        filesorter.sortfilesbyexperiment(folders, function(sortedFiles) {
            resolve(sortedFiles)
        })
    })
}

console.log("Mass Converter v2".yellow)
console.log("Maryland Energy Innovation Institute".blue)
let arguments = process.argv
console.log(arguments)
if (arguments.length > 2) {
    let foldersCreated = ['C:\\Users\\Jonathan\\MassConverterV2\\test\\EIS_OCV_IV_600_aging_100sccmO2']
    let experimentTypes = {}
    let mainFunction = async (_) => {
        // await getFolders().then(function (result) {
        //     foldersCreated = result
        // })
        await sortFiles(foldersCreated).then(function (result) {
            console.log(result)
        })

    }
    mainFunction()
} else {
    console.log("Error! No argument was given. (Ex. 'node index.js <filepath to mdat files>)".red)
}

