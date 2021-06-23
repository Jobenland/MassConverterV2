const colors = require("colors")
const filehandler = require("./helper_functions/filehandler")

console.log("Mass Converter v2".yellow)
console.log("Maryland Energy Innovation Institute".blue)
let arguments = process.argv
console.log(arguments)
if (arguments.length > 2) {
    filehandler.manipulateFiles(process.argv[2])
} else {
    console.log("Error! No argument was given. (Ex. 'node index.js <filepath to mdat files>)".red)
}


