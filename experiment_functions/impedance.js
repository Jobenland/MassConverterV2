const fs = require("fs")
const lineReader = require("line-reader")
const { resolve } = require("path")

function locateFirstCross(arr) {
    return new Promise(function (resolve, reject) {
        for (let index = 0; index < arr.length; index++) {
            if (index === arr.length-1) {
                resolve(-99999) 
            } else {
                let currentValues = arr[index].split("\t")
                let nextValues = arr[index+1].split("\t")
                // console.log(currentValues)
                if (Number(currentValues[5]) > 0) {
                    if(Number(nextValues[5]) < 0){
                        resolve([Number(currentValues[5]),Number(currentValues[4])])
                    }
                }
            }
        }
    })
}

function locateSecondCross(arr, first, firstCorrespondingValue) {
    return new Promise(function (resolve, reject) {
        if (first === -9999){
            resolve(-9999)
        }
        for (let index = 0; index < arr.length; index++) {
            if (index === arr.length-1) {
                let currentValues = arr[index].split("\t")
                resolve(currentValues[5])
            } else {
                let currentValues = arr[index].split("\t")
                let nextValues = arr[index+1].split("\t")
                // console.log(currentValues)
                if (Number(currentValues[5]) < 0 && Number(currentValues[4]) > firstCorrespondingValue) {
                    if(Number(nextValues[5]) > 0){
                        resolve(Number(currentValues[5]))
                    }
                }
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
            if (line.includes("End Header:")) {
                inHeader = false
            }
            if (last) {
                let package = []
                package.push(data)
                package.push(date)
                package.push(time)
                resolve(package)
            }
        })
    })
}

function compute(file, _callback) {
    let data = []
    let firstValue = -9999
    let values = {
        time: "",
        ohmic: -9999,
        tasr: -9999,
        electrode: -9999,
    }
    let analyze = async (_) => {
        await gatherData(file).then(function (result) {
            data = result[0]
            values['time'] = `${result[1]} ${result[2]}`
        })
        await locateFirstCross(data).then(function (result) {
            values['ohmic'] = result[0]
            firstValue = result[1]

        })
        await locateSecondCross(data, values['ohmic'], firstValue).then(function (result) {
            values['tasr'] = result
        })
        values['electrode'] = values['ohmic'] - values['tasr']
        _callback(values)
    }
    analyze()
}

module.exports = { compute }