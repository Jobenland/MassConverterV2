const fs = require("fs")
const lineReader = require("line-reader")
const { resolve } = require("path")

function gatherMinute(arr,osvValue) {
    return new Promise(function (resolve, reject) {
        data = []
        for (let index = 0; index < arr.length; index++) {
            if (index % 60 === 0) {
                let values = arr[index].split("\t")
                if (index === 0) {
                    data.push({time: values[0], ev: values[1], i: values[2], osv: osvValue})
                } else {
                    data.push({time: values[0], ev: values[1], i: values[2], osv: ""})
                }
            }
            if (index === arr.length-1) {
                resolve(data)
            }
        }
    })
}

function gatherData(file) {
    return new Promise(function (resolve, reject) {
        inHeader=true
        let data = []
        let date = ""
        let time = ""
        let osv = ""
        lineReader.eachLine(file, function(line, last) {
            if (!inHeader) {
                data.push(line)
            }
            if (line.includes("Date:")) {
                date = line.replace("Date:","").trim()
            }
            if (line.includes("Time:") && (line.includes("PM") || line.includes("AM"))) {
                time = line.replace("Time:","").trim()
            }
            if (line.includes("Open Circuit Potential")) {
                osv = line.replace("Open Circuit Potential (V):","").trim()
            }
            if (line.includes("End Header:")) {
                inHeader = false
            }
            if (last) {
                let package = []
                package.push(data)
                package.push(date)
                package.push(time)
                package.push(osv)
                resolve(package)
            }
        })
    })
}

function compute(file, _callback) {
    let data = []
    let smallerData = []
    let osv = 0
    let analyze = async (_) => {
        await gatherData(file).then(function (result) {
            data = result[0]
            osv = result[3]
        })
        await gatherMinute(data, osv).then(function (result) {
            smallerData = result
        })
        _callback(smallerData)
    }
    analyze()
}

module.exports = { compute }