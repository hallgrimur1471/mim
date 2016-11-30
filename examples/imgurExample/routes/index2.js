const express = require('express');
const imgur = require('imgur-node-api');
const path = require('path');
const fs = require('fs');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  const clientIDPath = path.join(__dirname, 'clientID.txt');
  const clientID = fs.readFile(clientIDPath, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    imgur.setClientID(data);
  });


  //console.log('STARTING UPLOAD...');
  //imgur.upload('public/images/japan.jpg', function (err, res) {
  //  if (err) {
  //    return console.log(err);
  //  }
  //  console.log('RES.DATA \n' + JSON.stringify(res.data));
  //  console.log('RES.DATA.LINK \n' + res.data.link); // Log the imgur url 
  //});
   
  //imgur.upload('http://25.media.tumblr.com/tumblr_md1yfw1Dcz1rsx19no1_1280.png', function (err,res) {
  //  console.log(res.data.link);
  //});
   
        //imgur.delete('mEGzEiBQwLVfGvY', function (err,res) {
        //  console.log(JSON.stringify(res.data));
        //});
   
  imgur.update({
    id: 'JuHonC5sBgCrzdr',
    title: 'New Title',
    description: 'New Description'
  }, function (err,res) {
    console.log('UPDATE: \n' + JSON.stringify(res.data));
  });
   
  imgur.getCredits(function (err, res) {
    if (err) {
      return console.log(err);
    }
    console.log('IMGUR.GETCREDITS \n' + JSON.stringify(res.data));
  });

  res.render('index', { title: 'Express' });
});


module.exports = router;
