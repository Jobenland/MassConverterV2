const fs = require("fs");
const galvanodynamic = require("../experiment_functions/galvanodynamic");
const impedance = require("../experiment_functions/impedance")
const static = require("../experiment_functions/static")
const filegenerator = require("../helper_functions/filegenerator");
const path = require("path")

function findMinTime(staticData) {
  return new Promise(function (resolve, reject) {
      let timeArray = []
      let minTime = 0
      for (let index = 0; index < staticData.length; index++) {
        timeArray = timeArray.concat(staticData[index]["normalizedTime"])
      }
      minTime = Math.min(...timeArray)
      for (let index = 0; index < staticData.length; index++) {
        staticData[index]["normalizedTime"] = staticData[index]["normalizedTime"] - minTime
        // let newDate = new Date(staticData[index]["time"])
        // newDate.setSeconds(newDate.getSeconds() + staticData[index]["normalizedTime"])
        // staticData[index]["time"] = `${("0" + (newDate.getMonth() + 1)).slice(-2)}/${("0" + newDate.getDate()).slice(-2)}/${newDate.getFullYear().toString()} ${("0" + newDate.getHours()).slice(-2).toString()}:${("0" + newDate.getMinutes()).slice(-2).toString()}:${("0" + newDate.getSeconds()).slice(-2).toString()}`
      }
      
      resolve(staticData)
  });
}

function computeGalvanodynamic(file) {
  return new Promise(function (resolve, reject) {
    galvanodynamic.compute(file, function (worked) {
      resolve(worked);
    });
  });
}

function computeImpedance(file) {
  return new Promise(function (resolve, reject) {
    impedance.compute(file, function (worked) {
      resolve(worked);
    });
  });
}

function computeStatic(file) {
  return new Promise(function (resolve, reject) {
    static.compute(file, function (worked) {
      resolve(worked);
    });
  });
}

function fileDriver(experiments, _callback) {
  let driver = async (_) => {
    for ([key, val] of Object.entries(experiments)) {
        if (!fs.existsSync(`${val["path"]}\\Data`)) {
            fs.mkdirSync(`${val["path"]}\\Data`);
        }

        /*
        **************
        GALVANODYNAMIC
        **************
        */

        let galvanodynamicData = [];
        for (let index = 0; index < val["galvanodynamic"].length; index++) {
            await computeGalvanodynamic(val["galvanodynamic"][index]).then(
            function (result) {
                galvanodynamicData.push(result);
            }
            );
        }
        filegenerator.createCSV(
            [
            { id: "time", title: "Time" },
            { id: "ppd", title: "PPD" },
            ],
            galvanodynamicData,
            `${val["path"]}\\Data\\Galvanodynamic.csv`
        );


        /*
        *********
        IMPEDANCE
        *********
        */
    
        let impedanceData = [];
        for (let index = 0; index < val["impedance"].length; index++) {
            if (path.extname(val["impedance"][index]) == ".z") {
                await computeImpedance(val["impedance"][index]).then(
                function (result) {
                    impedanceData.push(result);
                }
                );
            }
        }
        filegenerator.createCSV(
            [
            { id: "time", title: "Time" },
            { id: "ohmic", title: "Ohmic" },
            { id: "tasr", title: "TASR" },
            { id: "electrode", title: "Electrode" },
            ],
            impedanceData,
            `${val["path"]}\\Data\\Impedance.csv`
        );

        /*
        ******************************
        Galvanostatic & Potentiostatic
        ******************************
        */
        if (val["galvanostatic"].length > 0) {
            let staticData = [];
            for (let index = 0; index < val["galvanostatic"].length; index++) {
            await computeStatic(val["galvanostatic"][index]).then(function (result) {
                  staticData =staticData.concat(result)
              }
            );
          }
          await findMinTime(staticData).then(function (result) {
                staticData = result
            }
          );
          filegenerator.createCSV(
          [
              { id: "time", title: "Time (EPOCH)" },
              { id: "normalizedTime", title: "Normalized Time" },
              { id: "ev", title: "E(V)" },
              { id: "i", title: "I(A/cm2)" },
              { id: "ocv", title: "OCV" },
          ],
          staticData,
          `${val["path"]}\\Data\\Galvanostatic+OCV.csv`
          );
        } else if (val["potentiostatic"].length > 0) {

            /*
            ******************************
            Galvanostatic & Potentiostatic
            ******************************
            */
        
            let staticData = [];
            for (let index = 0; index < val["potentiostatic"].length; index++) {
              await computeStatic(val["potentiostatic"][index]).then(function (result) {
                      staticData = staticData.concat(result)
                  }
              );
            }
            await findMinTime(staticData).then(function (result) {
                staticData = result
              }
            );
            filegenerator.createCSV(
            [
                { id: "time", title: "Time" },
                { id: "ev", title: "E(V)" },
                { id: "i", title: "I(A/cm2)" },
                { id: "ocv", title: "OCV" },
            ],
            staticData,
            `${val["path"]}\\Data\\Potentiostatic+OCV.csv`
            );
        }

    }
  };
  driver();
}

module.exports = { fileDriver };
