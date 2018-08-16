# mim
## Synopsis

mim is a webpage that allows users to upload geotagged pictures into a database. The pictures are displayed on a map where they were taken and can also be displayed.

The website is hosted at [mapim.herokuapp.com](http://mapim.herokuapp.com)

## Code Example

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
```javascript
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

## Motivation

This is a school project in web developing. It was developed on github and deployed to heroku and can be viewed [here](http://mapim.herokuapp.com).

## Installation and setup

1. [Download and install Node](http://nodejs.org)

2. This project reguires a postgres database, see line 8 in index.js

2. Download and unzipp from github.
then from the mim rootfolder type:

⋅⋅⋅npm install
⋅⋅⋅npm start

## Getting involved

We encourage people to get involved so feel free to make a push request.