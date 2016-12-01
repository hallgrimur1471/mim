const basemap0 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 17,
});
const Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  maxZoom: 17,
});

const mymap = L.map('mapid', {
  layers: [Esri_WorldImagery], // only add one!
}).setView([64.127, -21.817], 12);

const baseLayers = {
  "street map": basemap0,
  "satellite map": Esri_WorldImagery,
};

L.control.layers(baseLayers).addTo(mymap);

const data = [];

$.ajax({
  url: "/api/getMarkers",
  success: (results) => {
    results = JSON.parse(results);

    results.forEach((row) => {
      let gpslatitude = JSON.stringify(row.gpslatitude);
      gpslatitude = '[' + gpslatitude.substring(2, gpslatitude.length - 2) + ']';
      gpslatitude = JSON.parse(gpslatitude);
      const latituderef = JSON.stringify(row.gpslatituderef);
      const latcalc = convertDMSToDD(gpslatitude[0], gpslatitude[1], gpslatitude[2], latituderef.substring(2, latituderef.length - 2));

      let gpslongtitude = JSON.stringify(row.gpslongtitude);
      gpslongtitude = '[' + gpslongtitude.substring(2, gpslongtitude.length - 2) + ']';
      gpslongtitude = JSON.parse(gpslongtitude);
      const longtituderef = JSON.stringify(row.gpslongtituderef);
      const longcalc = convertDMSToDD(gpslongtitude[0], gpslongtitude[1], gpslongtitude[2], longtituderef.substring(2, longtituderef.length - 2));

      // data.push(`<li><a href="/list/${row.imageservername.toString()}">${row.imageservername.toString()}</a></li>`);

      data.push([parseFloat(latcalc), parseFloat(longcalc), (row.comment || 'no comment'), row.imageservername]);
    });

    displayMarkers();
  },
});

function convertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}

function displayMarkers() {
  for (let i = 0; i < data.length; i++) {
    marker = new L.marker([data[i][0], data[i][1]])
    .bindPopup('<img style="width:100%"  id="image"+ i alt="' + data[i][2] + '" src="' + data[i][3] + '" ><br>' + data[i][2], { minWidth:100 })
    .addTo(mymap).on('click', onClick);

    marker.on('mouseover', function (e) {
      this.openPopup();
    });
    marker.on('mouseout', function (e) {
      this.closePopup();
    });
  }
}

const info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = '<h1>Import image</h1>'
                      + '<p>Welcome to the Import image page!</p>'
                      + '<span class="close" onclick="info.remove()">&times;</span>'
                      + '<form method="POST" action="/" enctype="multipart/form-data">'
                      + '<p></p>'
                      + '<label for="image_comment">comment: </label>'
                      + '<input id="image_comment" type="text" name="comment" placeholder="comment">'
                      + '<p></p>'
                      + '<label for="image_import">Import image: </label>'
                      + '<input id="image_import" type="file" name="myFile" accept=".jpg">'
                      + '<p></p>'
                      + '<button class="btn btn-primary" type="submit">Submit'
                      + '</button>'
                      + '</form>';
};

L.easyButton('glyphicon glyphicon-upload', () => { mymap.addControl(info); }).addTo(mymap);

L.easyButton('glyphicon glyphicon-question-sign', () => {
  $("#modalPopup").modal('show');
}).addTo(mymap);

L.easyButton('glyphicon glyphicon-globe', () => {
  mymap.setView([35.0082419, -18.8962449], 2);
}).addTo(mymap);

L.easyButton('glyphicon glyphicon-zoom-out', () => {
  mymap.setView([65.0082419, -18.8962449], 7);
}).addTo(mymap);


function onClick(e) {
  const modal = document.getElementById('myModal');

  // Get the image and insert it inside the modal - use its "alt" text as a caption
  const img = document.getElementById('image');
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");

  modal.style.display = "block";
  modal.style.zIndex = 1000;
  modalImg.src = img.src;
  captionText.innerHTML = img.alt;

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

$(document).ready(() => {
  if (window.location.pathname === '/') {
    $('#modalPopup').modal('show');
  }
});
