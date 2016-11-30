const exif = require('./harvestExif.js');
const pgp = require('pg-promise')();
const imgur = require('imgur-node-api');
const path = require('path');
const fs = require('fs');

function processImage(destination, fileNameOnServer, db) {
  var p1 = new Promise(
    function(resolve, reject) {
      console.log('promise started!\n');
      exif.getExifData(destination, fileNameOnServer, function exifDataResponse(result) {
        console.log('EXIF DATA:\n' + JSON.stringify(result));
        console.log('GPSLatitude:\n' + JSON.stringify(result.gps.GPSLatitude));
        console.log('IMAGE\n' + result.image.Make);

        const gps = result.gps;

        console.log('GPS:\n' + JSON.stringify(gps));
        console.log('GPS LONGTITUDE: \n' + gps.GPSLongitude);

        const clientIDPath = path.join(__dirname, 'clientID.txt');
        const clientID = fs.readFile(clientIDPath, 'utf8', function clientIDResponse(err, data) {
        if (err) {
          reject(error);
          //return console.log(err);
        }
        imgur.setClientID(data);

        console.log('STARTING UPLOAD...');
        imgur.upload(destination + fileNameOnServer, function uploadResponse(err, ires) {
          if (err) {
            reject(error);
            //return console.log(err);
          }

          console.log('ires.DATA \n' + JSON.stringify(ires.data));
          console.log('ires.DATA.LINK \n' + ires.data.link); // Log the imgur url 
          console.log('ADD 1 \n' + gps.GPSLatitude);
          console.log('ADD 2 \n' + gps.GPSLatitudeRef);
          console.log('ADD 3 \n' + gps.GPSLongitude);
          console.log('ADD 4 \n' + gps.GPSLongitudeRef);
          console.log('ADD 5 \n' + result.image.Make);
          console.log('ADD 6 \n' + ires.data.link);
          console.log('ADD 7 \n' + fileNameOnServer);
          console.log('ADD 8 \n' + ires.data.deletehash);

          db.none(`INSERT INTO images (gpslatitude, gpslatituderef, gpslongtitude, gpslongtituderef, comment, imageservername, originalname, deletehash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [gps.GPSLatitude, gps.GPSLatitudeRef, gps.GPSLongitude, gps.GPSLongitudeRef, result.image.Make, ires.data.link, fileNameOnServer, ires.data.deletehash])
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
        });
      });
      }, (error) => {
          console.log(error);
          res.render('error', {
            title: 'Oh no!',
            message: 'An unexpected error occured when making your request, '
                   + 'perhaps you can try again later.' });
        });
    }
  );
  return p1;
}

module.exports = {
  processImage
}