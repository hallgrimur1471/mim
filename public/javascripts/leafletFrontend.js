//var mymap = L.map('mapid').setView([64.127, -21.817], 13);
var basemap0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 18
});
var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var mymap = L.map('mapid', {
  layers: [Esri_WorldImagery] // only add one!
}).setView([64.127, -21.817], 13);

var baseLayers = {
	"street map": basemap0,
	"satellite map": Esri_WorldImagery
};


L.control.layers(baseLayers).addTo(mymap);


var mynd = L.icon({
  iconUrl: src="geotagged_photo_from_nexus.jpg",
    icony:     [400, 400], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  });

var data = [[64.127, -21.817, 'Thetta er mynd af einhverju', 'thumbnail.png'],[64.117, -21.807, 'Thetta er onnur mynd af einhverju', 'geotagged_photo_from_nexus.jpg'],
[64.100, -21.707, 'Thetta er thridja mynd af einhverju', 'DSC09107_geotag.jpg']];



for (var i = 0; i < data.length; i++) {
  marker = new L.marker([data[i][0],data[i][1]])
  .bindPopup('<img style="width:100%"  id="image"+ i alt="'+ data[i][2] +'" src="/'+ data[i][3] +'" ><br>' + data[i][2], {minWidth:100})
  .addTo(mymap).on('dblclick', onDoubleClick);
  marker.on('mouseover', function (e) {
    this.openPopup();
  });
  marker.on('mouseout', function (e) {
    this.closePopup();
  });


}

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

// Get the <span> element that closes the modal

L.easyButton('<img alt="do this" src=/Button.png>', function(){mymap.addControl(info)}).addTo(mymap);
//mymap.addControl(info);






function onDoubleClick(e) {
  var modal = document.getElementById('myModal');

  // Get the image and insert it inside the modal - use its "alt" text as a caption
  var img = document.getElementById('image');
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");

  modal.style.display = "block";
  modal.style.zIndex = 1000;
  modalImg.src = img.src;
  captionText.innerHTML = img.alt;

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}


var helloPopup = L.popup().setContent();

L.easyButton('<img src="/Button.png">', function(mymap){
//  helloPopup.setLatLng(mymap.getCenter()).openOn(mymap);
info.hide();

  //info.addTo(mymap);
}).addTo(mymap);