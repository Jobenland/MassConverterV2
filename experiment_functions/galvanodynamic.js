const fs = require("fs")
const lineReader = require("line-reader")
const { resolve } = require("path")

//FIXME do you want number before or after cross
function locateFirstCross(arr) {
    return new Promise(function (resolve, reject) {
        for (let index = 0; index < arr.length; index++) {
            if (index === arr.length-1) {
                resolve(-99999) 
            } else {
                let currentValues = arr[index].split("\t")
                let nextValues = arr[index+1].split("\t")
                console.log(currentValues)
                if (Number(currentValues[1]) > 0) {
                    if(Number(nextValues[1]) < 0){
                        resolve(currentValues[1]) 
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

function multiplyMax(arr) {
    return new Promise(function (resolve, reject) {
        let max = -999999
        let multiply = []
        for (let index = 0; index < arr.length; index++) {
            if (index === arr.length-1) {
                let max = multiply.reduce((a, b) => { return Math.max(a, b) });
                resolve(max)
            } else {
                let currentValues = arr[index].split("\t")
                // console.log(currentValues)
                multiply.push(Number(currentValues[1])*Number(currentValues[2]))
            }
        }
    })
}
function compute(file, _callback) {
    let data = []
    let values = {
        time: "",
        ppd: -9999,
    }
    let analyze = async (_) => {
        await gatherData(file).then(function (result) {
            data = result[0]
            values['time'] = `${result[1]} ${result[2]}`
        })
        await multiplyMax(data).then(function (result) {
            values['ppd'] = result
        })
        _callback(values)
    }
    analyze()
}

module.exports = { compute }