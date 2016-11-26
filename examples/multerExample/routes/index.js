var express = require('express');
var exif = require('exif-js');  // used to get exif data
var multer = require('multer'); // used for uploading files

var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {

	//getExif((result) => {
	//	console.log(model);
	//});

  res.render('exif', { title: 'Import image' });
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
  res.render('exif', { title: 'Import image' });
});



//function getExif(callback) {
//    var img1 = document.getElementById("img1");
//    EXIF.getData(img1, function() {
//        var make = EXIF.getTag(this, "Make");
//        var model = EXIF.getTag(this, "Model");
//        var makeAndModel = document.getElementById("makeAndModel");
//        makeAndModel.innerHTML = `${make} ${model}`;
//        console.log(make);
//		    callback(model);
//    });

//    var img2 = document.getElementById("img2");
//    EXIF.getData(img2, function() {
//        var allMetaData = EXIF.getAllTags(this);
//        var allMetaDataSpan = document.getElementById("allMetaDataSpan");
//        allMetaDataSpan.innerHTML = JSON.stringify(allMetaData, null, "\t");
//    });

module.exports = router;
