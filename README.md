# mim
##Synopsis

mim is a database system that allows users to upload geotagged pictures in a database. The pictures are displayed on a map where they were taken and can also be displayed.

##Code Example

The mapview is build with leaflet
```javascript
var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  maxZoom: 17
});


var mymap = L.map('mapid', {
  layers: [Esri_WorldImagery] // only add one!
}).setView([64.127, -21.817], 12);

var baseLayers = {
  "street map": basemap0,
  "satellite map": Esri_WorldImagery
};

L.control.layers(baseLayers).addTo(mymap);
```


router post to import image to database and display a marker.
```
router.post('/', upload.single('myFile'), function(req, res, next) {
  console.log(req.body);
  console.log(req.file);
  console.log('SERVER FILE NAME\n' + req.file.filename);

  const destination = req.file.destination;
  const fileNameOnServer = req.file.filename;

  imageprocess.processImage(destination, fileNameOnServer, req.body.comment, db)
  .then(data => {
    console.log('image processed!');
    res.redirect('/import');
  })
```

##Motivation

This is a school project in web developing. It was developed in github and deployed in "<a href="http://mapim.herokuapp.com/">Heroku</a> ==$0" in 2016.


##Installation and setup


1. [Download and install Node](http://nodejs.org)

2. This project reguires a postgres database, see in line 8 in index.js

2. Download and unzipp from github.
then from the mim rootfolder type:

...npm install
...npm start


##Getting involved
We encourage people to get involved so feel free to make a push request.
