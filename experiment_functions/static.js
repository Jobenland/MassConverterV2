const fs = require("fs")
const lineReader = require("line-reader")
const { resolve } = require("path")

function gatherMinute(arr,ocvValue, time) {
    return new Promise(function (resolve, reject) {
        data = []
        for (let index = 0; index < arr.length; index++) {
            if (index % 300 === 0) {
                let values = arr[index].split("\t")
                let date = new Date(time)
                if (index === 0) {
                    data.push({time: `${date.getTime()}`, normalizedTime: Number(values[0]), ev: values[1], i: values[2], ocv: ocvValue})
                } else {
                    data.push({time: `${date.getTime()}`, normalizedTime: Number(values[0]), ev: values[1], i: values[2], ocv: ""})
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
        let ocv = ""
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
                ocv = line.replace("Open Circuit Potential (V):","").trim()
            }
            if (line.includes("End Header:")) {
                inHeader = false
            }
            if (last) {
                let package = []
                package.push(data)
                package.push(date)
                package.push(time)
                package.push(ocv)
                resolve(package)
            }
        })
    })
}

function compute(file, _callback) {
    let data = []
    let smallerData = []
    let ocv = 0
    let analyze = async (_) => {
        await gatherData(file).then(function (result) {
            data = result[0]
            time = `${result[1]} ${result[2]}`
            ocv = result[3]
        })
        await gatherMinute(data, ocv, time).then(function (result) {
            smallerData = result
        })
        _callback(smallerData)
    }
    analyze()
}

module.exports = { compute }