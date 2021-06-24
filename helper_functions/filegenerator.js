const createCSVWriter = require('csv-writer').createObjectCsvWriter

function createCSV(headers,data,path){
    let csvWriter = createCSVWriter({
        path: path,
        header: headers
    })
    csvWriter.writeRecords(data).then(()=> {
        console.log("Successfully created file")
    })
}

module.exports = { createCSV }