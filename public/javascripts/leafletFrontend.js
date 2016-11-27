var mymap = L.map('mapid').setView([64.127, -21.817], 13);
var basemap0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 18
});
var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
basemap0.addTo(mymap);
Esri_WorldImagery.addTo(mymap);
const position = [64.127, -21.817];

var data = [[64.127, -21.817, 'Thetta er mynd af einhverju'],
            [64.117, -21.807, 'Thetta er onnur mynd af einhverju'],
           ];

for (var i = 0; i < data.length; i++) {
  marker = new L.marker([data[i][0],data[i][1]])
  .bindPopup(data[i][2])
  .addTo(mymap);
}

var mynd = L.icon({
  iconUrl: src="geotagged_photo_from_nexus.jpg",

  iconSize:     [50, 50], // size of the icon
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
L.marker([64.121, -21.817], {icon: mynd}).addTo(mymap);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = '<h1>Import image</h1>'
                        +'<p>Welcome to the Import image page!</p>'
                        +'<form method="POST" action="/" enctype="multipart/form-data">'
                        +'<p></p>'
                        +'<label for="image_title">New image title: </label>'
                        +'<input id="image_title" type="text" name="title" placeholder="title">'
                        +'<p></p>'
                        +'<label for="image_import">Import image: </label>'
                        +'<input id="image_import" type="file" name="myFile" accept=".jpg">'
                        +'<p></p>'
                        +'<button class="btn btn-primary" type="submit">Submit'
                        +'</button></form>';
//  this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
//      '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
//      : 'Hover over a state');
};

info.addTo(mymap);