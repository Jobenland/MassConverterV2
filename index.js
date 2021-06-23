const colors = require("colors")
const filehandler = require("./helper_functions/filehandler")

function getFolders() {
    return new Promise(function (resolve, reject) {
        filehandler.manipulateFiles(process.argv[2], function(foldersCreated) {
            resolve(foldersCreated)
        })
    })
}

console.log("Mass Converter v2".yellow)
console.log("Maryland Energy Innovation Institute".blue)
let arguments = process.argv
console.log(arguments)
if (arguments.length > 2) {
    let foldersCreated = []
    let mainFunction = async (_) => {
        await getFolders().then(function (result) {
            foldersCreated = result
        })
        console.log(foldersCreated)
    }
    mainFunction()
} else {
    console.log("Error! No argument was given. (Ex. 'node index.js <filepath to mdat files>)".red)
}

