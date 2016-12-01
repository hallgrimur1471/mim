const exif = require('./harvestExif.js');
const imgur = require('imgur-node-api');
const path = require('path');
const fs = require('fs');

function processImage(destination, fileNameOnServer, comment, db) {
  const promise = new Promise(
    (resolve, reject) => {
      exif.getExifData(destination, fileNameOnServer, function exifDataResponse(result) {
        const gps = result.gps;

        const clientIDPath = path.join(__dirname, 'clientID.txt');
        fs.readFile(clientIDPath, 'utf8', function clientIDResponse(err, data) {
          if (err) {
            reject(err);
          }
          imgur.setClientID(process.env.IMGUR_CLIENT_ID || data);

          imgur.upload(destination + fileNameOnServer, function uploadResponse(uerr, ires) {
            if (uerr) {
              reject(uerr);
            }

            db.none(`INSERT INTO images (gpslatitude, gpslatituderef, gpslongtitude, gpslongtituderef, comment, imageservername, originalname, deletehash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [gps.GPSLatitude, gps.GPSLatitudeRef, gps.GPSLongitude, gps.GPSLongitudeRef, comment, ires.data.link, fileNameOnServer, ires.data.deletehash])
          .then((dbdata) => {
            resolve(dbdata);
          })
          .catch((error) => {
            reject(error);
          });
          });
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
