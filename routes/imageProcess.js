const exif = require('./harvestExif.js');
const imgur = require('imgur-node-api');
// const path = require('path');

function processImage(destination, fileNameOnServer, comment, db) {
  const promise = new Promise(
    (resolve, reject) => {
      exif.getExifData(destination, fileNameOnServer, function exifDataResponse(result) {
        const gps = result.gps;

        // const clientIDPath = path.join(__dirname, 'clientID.txt');
        imgur.setClientID(process.env.IMGUR_CLIENT_ID || '06ea0abbf4b0754'); // had to hardcode since heroku will delete clientID.txt on dyno reset

        imgur.upload(destination + fileNameOnServer, function uploadResponse(uerr, ires) {
          if (uerr) {
            reject(uerr);
          }

          if (!gps.GPSLatitude || !gps.GPSLatitudeRef || !gps.GPSLongitude || !gps.GPSLongitudeRef) {
            reject('no_exif');
          } else {
            db.none(`INSERT INTO images (gpslatitude, gpslatituderef, gpslongtitude, gpslongtituderef, comment, imageservername, originalname, deletehash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [gps.GPSLatitude, gps.GPSLatitudeRef, gps.GPSLongitude, gps.GPSLongitudeRef, comment, ires.data.link, fileNameOnServer, ires.data.deletehash])
            .then((dbdata) => {
              resolve(dbdata);
            })
            .catch((error) => {
              reject(error);
            });
          }
        });
      }, (error) => {
        reject(error);
      });
    }
  );
  return promise;
}

module.exports = {
  processImage,
};
