const express = require('express');
const multer = require('multer'); // used for uploading files
const exif = require('./harvestExif.js');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index_kort', { title: 'Express' });
});

/* POST image. */
router.post('/', upload.single('myFile'), function(req, res, next) {
  console.log(req.body);
  console.log(req.file);
  console.log('SERVER FILE NAME\n' + req.file.filename)
  const destination = req.file.destination;
  const fileNameOnServer = req.file.filename;
  exif.getExifData(destination, fileNameOnServer, (result) => {
    console.log('EXIF DATA:\n' + result);
    console.log('IMAGE\n' + result.image.Make);
    res.render('index_kort');
  }, (error) => {
    console.log(error);
    res.render('error', {
      title: 'Oh no!',
      message: 'An unexpected error occured when making your request, '
             + 'perhaps you can try again later.' });
  });
});

module.exports = router;
