const express = require('express');
const multer = require('multer'); // used for uploading files
const imageprocess = require('./imageProcess.js');
const pgp = require('pg-promise')();
const xss = require('xss');

const router = express.Router();
const DATABASE = process.env.DATABASE_URL || 'postgres://hallgrimur1471:pass@localhost/mimdb2';
const db = pgp(DATABASE);

// location to temporarily store images before imgur upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

function displayUserErrorMessage(res) {
  res.render('error', {
    title: 'Oh no!',
    message: 'An unexpected error occured when making your request, '
           + 'perhaps you can try again later.' });
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index_kort');
});

/* GET page after image import (front-end notices changed url). */
router.get('/import', (req, res, next) => {
  res.render('index_kort');
});

/* GET marker data. */
router.get('/api/getMarkers', (req, res, next) => {
  db.any(`SELECT * FROM images`)
    .then((data) => {
      res.send(JSON.stringify(data));
    })
    .catch((error) => {
      displayUserErrorMessage(res);
    });
});

/* POST image. */
router.post('/', upload.single('myFile'), (req, res, next) => {
  const destination = req.file.destination;
  const fileNameOnServer = req.file.filename;

  imageprocess.processImage(destination, fileNameOnServer, req.body.comment, db)
  .then((data) => {
    res.redirect('/import');
  })
  .catch((error) => {
    console.log('!ERROR!: ' + error);
    if( error === 'Error: No Exif segment found in the given image.' ) {
      res.render('error', {
      title: 'No GPS data',
      message: 'The image you tried to import does not contain GPS EXIF data, '
             + 'you have to import an image that is geotagged.' });
    }
    displayUserErrorMessage(res);
  });
});

module.exports = router;
