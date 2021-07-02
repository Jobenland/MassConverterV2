const colors = require("colors")
const figlet = require("figlet")
const figures = require('figures')
const filehandler = require("./helper_functions/filehandler")
const filesorter = require("./helper_functions/filesorter")
const analysisdriver = require("./helper_functions/analysisdriver")

//Finds the MDAT files, converts them to zip, and then extracts them to a folder with the name name as the file
//This function returns the list of folders to perform analysis on
function getFolders() {
    return new Promise(function (resolve, reject) {
        filehandler.manipulateFiles(process.argv[2], function(foldersCreated) {
            resolve(foldersCreated)
        })
    })
}

//Sorts through each folder and organizes them by their experiment
//Please see the ReadME for the data structure of the returned object
function sortFiles(folders) {
    return new Promise(function (resolve, reject) {
        filesorter.sortfilesbyexperiment(folders, function(sortedFiles) {
            resolve(sortedFiles)
        })
    })
}

//This is the main driver that iterates through the files and tells the
//program what calculation to perform
function analyzeFiles(experimentDict) {
    return new Promise(function (resolve, reject) {
        analysisdriver.fileDriver(experimentDict, function(worked) {
            resolve(worked)
        })
    })
}



let arguments = process.argv
if (arguments.length > 2) {
    let foldersCreated = []
    let experimentTypes = {}
    let analyzedFiles = false
    let mainFunction = async (_) => {
        figlet("MEII", function (err, data) {
            console.log(data.cyan)
            console.log("Mass Converter v2 by Jonathan Obenland".yellow)
            console.log("v0.5-beta.3".green)
        })
        await getFolders().then(function (result) {
                foldersCreated = result
            })
        console.log(figures.tick.green, "Found MDAT Files and extracted their contents...")
        await sortFiles(foldersCreated).then(function (result) {
            experimentTypes = result
        })
        console.log(figures.tick.green, "Organized individual files into experiment specific categories...")
        await analyzeFiles(experimentTypes).then(function (result) {
            analyzedFiles = result
        })
        console.log(figures.tick.green, "Process Complete!")
        

    }
    mainFunction()
} else {
    console.log(figures.cross.red, "Error! No argument was given. (Ex. 'node index.js <filepath to mdat files>)".red)
}

