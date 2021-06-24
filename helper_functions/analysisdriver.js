const fs = require("fs")
const galvanodynamic = require("../experiment_functions/galvanodynamic")

function computeGalvanodynamic(file) {
    return new Promise(function (resolve, reject) {
        galvanodynamic.compute(file, function(worked) {
            resolve(worked)
        })
    })
}

function fileDriver(experiments, _callback){
    let driver = async (_) => {
        for([key, val] of Object.entries(experiments)) {
            if (!fs.existsSync(`${val['path']}\\Data`)){
                fs.mkdirSync(`${val['path']}\\Data`);
            }
            let galvanodynamicData = []
            for (let index = 0; index < val['galvanodynamic'].length; index++) {
                await computeGalvanodynamic(val['galvanodynamic'][index]).then(function (result) {
                    galvanodynamicData.push(result)
                })
            }
            console.log(galvanodynamicData)
        }
    }
    driver()
}

module.exports = { fileDriver }