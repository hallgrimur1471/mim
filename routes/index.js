const express = require('express');
const multer = require('multer'); // used for uploading files
const exif = require('./harvestExif.js');
const pgp = require('pg-promise')();
const xss = require('xss');

const router = express.Router();
const DATABASE = process.env.DATABASE_URL || 'postgres://hallgrimur1471:pass@localhost/mimdb2';
const db = pgp(DATABASE);

// location to store images
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

// GET list of items in database
router.get('/list', (req, res) => {
  db.any(`SELECT * FROM images`) //LIMIT 10 OFFSET 0
    .then(data => {
      console.log('DATA:\n' + JSON.stringify(data));

      const result = [`<ul>`];

      data.forEach(row => {
        console.log('ROW: ' + Object.keys(row));
        console.log('ROW.imageservername: ' + row.imageservername.toString());
        console.log('ROW.imageservername: ' + row.imageservername);
        result.push(`<li><a href="/list/${row.imageservername.toString()}">${row.imageservername.toString()}</a></li>`);
      })
      result.push('</ul>');

      res.send(result.join('\n'));
    })
    .catch(error => {
      res.send(`<p>Gat ekki sótt gögn: ${error}</p>`);
    });
});

// GET item in database
router.get('/list/:id', (req, res) => {
  console.log(req.params);
  //const id = parseInt(req.params.id, 10);
  const imageservername = req.params.id.toString();

  // id til að birta notanda, notum xss library til að koma í veg fyrir xss
  const displayId = xss(req.params.id);

  //if (isNaN(id) || id <= 0) {
  //  res.send(`<p>${displayId} er ekki gilt</p>`)
  //}

  db.one(`SELECT * FROM images WHERE imageservername = $1`, [imageservername])
    .then(data => {
      res.send(`<dl>
        <dt>GPSLatitude</dt>
        <dd>${data.gpslatitude}</dd>
        <dt>GPSLatitudeRef</dt>
        <dd>${data.gpslatituderef}</dd>
        <dt>GPSLongtitude</dt>
        <dd>${data.gpslongtitude}</dd>
        <dt>GPSLongtitudeRef</dt>
        <dd>${data.gpslongtituderef}</dd>
        <dt>comment</dt>
        <dd>${data.comment}</dd>
        <dt>imageServerName</dt>
        <dd>${data.imageservername}</dd>
</dl>`);
    })
    .catch(error => {
      res.send(`<p>Gat ekki sótt gögn: ${error}</p>`);
    });
});

// GET add page
router.get('/add', (req, res) => {
  res.send(`
<form method="post" action="/add">
  <div>
    <label for="gpslatitude">gpslatitude:</label>
    <input type="text" name="gpslatitude" id="gpslatitude">
  </div>
  <div>
    <label for="gpslatituderef">gpslatituderef:</label>
    <textarea name="gpslatituderef" id="gpslatituderef"></textarea>
  </div>
  <div>
    <label for="gpslongtitude">gpslongtitude:</label>
    <textarea name="gpslongtitude" id="gpslongtitude"></textarea>
  </div>
  <div>
    <label for="gpslongtituderef">gpslongtituderef:</label>
    <textarea name="gpslongtituderef" id="gpslongtituderef"></textarea>
  </div>
  <div>
    <label for="comment">comment:</label>
    <textarea name="comment" id="comment"></textarea>
  </div>
  <div>
    <label for="imageservername">imageservername:</label>
    <textarea name="imageservername" id="imageservername"></textarea>
  </div>
  <button>Skrá</button>
</form>
`);
});

// POST item to database
router.post('/add', (req, res) => {
  const gpslongtitude = xss(req.body.gpslongtitude || '');
  const gpslongtituderef = xss(req.body.gpslongtituderef || '');
  const gpslatitude = xss(req.body.gpslatitude || '');
  const gpslatituderef = xss(req.body.gpslatituderef || '');
  const comment = xss(req.body.comment || '');
  const imageservername = xss(req.body.imageservername || '');

  db.none(`INSERT INTO images (gpslatitude, gpslatituderef, gpslongtitude, gpslongtituderef, comment, imageservername) VALUES ($1, $2, $3, $4, $5, $6)`, [gpslongtitude, gpslongtituderef, gpslatitude, gpslatituderef, comment, imageservername])
    .then(data => {
      res.send('<p>Gögnum bætt við!</p>');
    })
    .catch(error => {
      res.send(`<p>Gat ekki bætt gögnum við: ${error}</p>`);
    });
})

/* POST image. */
router.post('/', upload.single('myFile'), function(req, res, next) {
  console.log(req.body);
  console.log(req.file);
  console.log('SERVER FILE NAME\n' + req.file.filename)
  const destination = req.file.destination;
  const fileNameOnServer = req.file.filename;
  exif.getExifData(destination, fileNameOnServer, (result) => {
    console.log('EXIF DATA:\n' + result.gps.gpslatitude);
    console.log('IMAGE\n' + result.image.Make);

    db.none(`INSERT INTO images (gpslatitude, gpslatituderef, gpslongtitude, gpslongtituderef, comment, imageservername) VALUES ($1, $2, $3, $4, $5, $6)`, [gpslongtitude, gpslongtituderef, gpslatitude, gpslatituderef, comment, imageservername])
    .then(data => {
      console.log('<p>Gögnum bætt við!</p>');
      res.render('index_kort');
    })
    .catch(error => {
      console.log(`<p>Gat ekki bætt gögnum við: ${error}</p>`);
      res.render('index_kort');
    });
  }, (error) => {
    console.log(error);
    res.render('error', {
      title: 'Oh no!',
      message: 'An unexpected error occured when making your request, '
             + 'perhaps you can try again later.' });
  });
});

module.exports = router;
