//var mymap = L.map('mapid').setView([64.127, -21.817], 13);
var basemap0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 17
});
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

//var data = [[64.127, -21.817, 'Thetta er mynd af einhverju', 'thumbnail.png'],[64.117, -21.807, 'Thetta er onnur mynd af einhverju', 'geotagged_photo_from_nexus.jpg'],
//[64.100, -21.707, 'Thetta er thridja mynd af einhverju', 'DSC09107_geotag.jpg']];

var data = [];

$.ajax({url: "/api/getMarkers", success: function(results) {
  console.log('RESULTS:\n' + results);

  results = JSON.parse(results);

  results.forEach(row => {
    console.log('ROW: \n' + JSON.stringify(row));
    console.log('ROW.GPSLATITUDE: \n' + JSON.stringify(row.gpslatitude));

    let gpslatitude = JSON.stringify(row.gpslatitude);
    gpslatitude = '[' + gpslatitude.substring(2,gpslatitude.length-2) + ']';
    gpslatitude = JSON.parse(gpslatitude);
    let latituderef = JSON.stringify(row.gpslatituderef);
    const latcalc = convertDMSToDD(gpslatitude[0], gpslatitude[1], gpslatitude[2], latituderef.substring(2, latituderef.length-2));
    console.log('GPSLATITUDE CALCULATED: \n' + latcalc);

    let gpslongtitude = JSON.stringify(row.gpslongtitude);
    gpslongtitude = '[' + gpslongtitude.substring(2,gpslongtitude.length-2) + ']';
    gpslongtitude = JSON.parse(gpslongtitude);
    let longtituderef = JSON.stringify(row.gpslongtituderef);
    console.log('longtituderef: \n' + longtituderef);
    const longcalc = convertDMSToDD(gpslongtitude[0], gpslongtitude[1], gpslongtitude[2], longtituderef.substring(2, longtituderef.length-2));
    console.log('GPSLONGITUDE CALCULATED: \n' + longcalc);

    //console.log('ARRAY: \n' + '[' + gpslatitude.substring(2,gpslatitude.length-2) + ']');
    //console.log('ROW.GPSLATITUDE: \n' + JSON.stringify(JSON.parse(row.gpslatitude)[0]));
    //data.push(`<li><a href="/list/${row.imageservername.toString()}">${row.imageservername.toString()}</a></li>`);
    data.push([parseFloat(latcalc), parseFloat(longcalc), (row.comment || 'no comment'), 'images/' + row.imageservername]);
  })

  displayMarkers();
}});

function convertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);

    console.log(direction + 'W');
    if (direction == "S" || direction == "W") {
        console.log('WEST!!!!!!!!!!!!!!!!!!!!!');
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

//$.get( '/searching',parameters, function(data) {
//       $('#results').html(data);

function displayMarkers() {

  console.log('DATA: \n' + data);

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
                          +'<span class="close" onclick="info.remove()">&times;</span>'
                          +'<form method="POST" action="/" enctype="multipart/form-data">'
                          +'<p></p>'
                          +'<label for="image_title">New image title: </label>'
                          +'<input id="image_title" type="text" name="title" placeholder="title">'
                          +'<p></p>'
                          +'<label for="image_import">Import image: </label>'
                          +'<input id="image_import" type="file" name="myFile" accept=".jpg">'
                          +'<p></p>'
                          +'<button class="btn btn-primary" type="submit">Submit'
                          +'</button>'
                          +'</form>';
  //  this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
  //      '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
  //      : 'Hover over a state');


  };

  L.easyButton( 'glyphicon glyphicon-upload', function(){mymap.addControl(info)}).addTo(mymap);
  //mymap.addControl(info);
  L.easyButton( 'glyphicon glyphicon-upload', function(){mymap.addControl(info)}).addTo(mymap);
  //mymap.addControl(info);

  // Get the <span> element that closes the modal

L.easyButton( 'glyphicon glyphicon-globe', function(){
  mymap.setView([35.0082419, -18.8962449], 2);
}).addTo(mymap);


  L.easyButton( 'glyphicon glyphicon-zoom-out', function(){
    mymap.setView([65.0082419, -18.8962449], 7);
  }).addTo(mymap);





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



}

/*

var helloPopup = L.popup().setContent();

L.easyButton('<img src="/Button.png">', function(mymap){
//  helloPopup.setLatLng(mymap.getCenter()).openOn(mymap);
  info.remove();

  //info.addTo(mymap);
}).addTo(mymap);

*/
