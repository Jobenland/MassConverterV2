const createCSVWriter = require('csv-writer').createObjectCsvWriter
const figures = require('figures');
const colors = require("colors")

function createCSV(headers,data,path){
    let csvWriter = createCSVWriter({
        path: path,
        header: headers
    })
    csvWriter.writeRecords(data).then(()=> {
        console.log(figures.tick.green, "Successfully created file at", `${path}`.red)
    })
}

module.exports = { createCSV }