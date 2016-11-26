const express = require('express');
const multer = require('multer'); // used for uploading files
const exif = require('./harvestExif.js');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {

	//getExif((result) => {
	//	console.log(model);
	//});

  res.render('exif', { title: 'Import image', exif: '' });
});

/* POST Image results. */
router.post('/', upload.single('myFile'), function(req, res, next) {
  //const textboxInput = req.body.multiplicationbox;

  //calculations(textboxInput, (result) => {
  //    res.render('results', {
  //      title: 'Niðurstöður margföldunnar',
  //      input: result.textboxInput,
  //      foundNumbers: result.foundNumbers,
  //      multiplicationResults: result.multiplicationResults,
  //      factors: result.factors
  //    });
  //  });

  console.log(req.body);
  console.log(req.file);
  console.log('SERVER FILE NAME\n' + req.file.filename)
  const destination = req.file.destination;
  const fileNameOnServer = req.file.filename;
  exif.getExifData(destination, fileNameOnServer, (result) => {
    console.log(result);
    console.log('IMAGE\n' + result.image.Make);
    res.render('exif', { title: 'Import image', exif: result });
  }, (error) => {
    console.log(error);
    res.render('error', {
      title: 'Oh no!',
      message: 'An unexpected error occured when making your request, '
             + 'perhaps you can try again later.' });
  });
});


//function getExif(callback) {
//    const img1 = document.getElementById("img1");
//    EXIF.getData(img1, function() {
//        const make = EXIF.getTag(this, "Make");
//        const model = EXIF.getTag(this, "Model");
//        const makeAndModel = document.getElementById("makeAndModel");
//        makeAndModel.innerHTML = `${make} ${model}`;
//        console.log(make);
//		    callback(model);
//    });

//    const img2 = document.getElementById("img2");
//    EXIF.getData(img2, function() {
//        const allMetaData = EXIF.getAllTags(this);
//        const allMetaDataSpan = document.getElementById("allMetaDataSpan");
//        allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
//    });

module.exports = router;
