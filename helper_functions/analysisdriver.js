const fs = require("fs");
const galvanodynamic = require("../experiment_functions/galvanodynamic");
const impedance = require("../experiment_functions/impedance")
const filegenerator = require("../helper_functions/filegenerator");
const path = require("path")

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
    
    //   let galvanodynamicData = [];
    //   for (let index = 0; index < val["galvanodynamic"].length; index++) {
    //     await computeGalvanodynamic(val["galvanodynamic"][index]).then(
    //       function (result) {
    //         galvanodynamicData.push(result);
    //       }
    //     );
    //   }
    //   filegenerator.createCSV(
    //     [
    //       { id: "time", title: "Time" },
    //       { id: "ppd", title: "PPD" },
    //     ],
    //     galvanodynamicData,
    //     `${val["path"]}\\Data\\Galvanodynamic.csv`
    //   );


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


    }
  };
  driver();
}

module.exports = { fileDriver };
