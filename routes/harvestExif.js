const ExifImage = require('exif').ExifImage;  // used to get exif data
/**
 * Fetches exif data from image in location 'destination'
 * with the name 'fileNameOnServer', eg:
 * destination: 'uploads/'
 * fileNameOnServer: 'image1.jpg'
 * @param {string} destination
 * @param {string} fileNameOnServer
 * @param {function} callback
 * @param {function} error
 * @returns {JSON obj} exif data
 */
function getExifData(destination, fileNameOnServer, callback, error) {
  try {
    const imagePath = destination + fileNameOnServer;
    new ExifImage({ image : imagePath }, function exifResponse(eerror, exifData) {
      if (eerror) {
        error(`Error: ${eerror.message}`);
      } else {
        callback(exifData);
      }
    });
  } catch (eerror) {
    error(`Error: ${eerror.message}`);
  }
}

module.exports = {
  getExifData,
};
