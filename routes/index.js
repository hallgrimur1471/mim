const express = require('express');
const multer = require('multer'); // used for uploading files
const exif = require('./harvestExif.js');
const pgp = require('pg-promise')();
const xss = require('xss');

const router = express.Router();
const DATABASE = process.env.DATABASE_URL || 'postgres://hallgrimur1471:pass@localhost/data';
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
  db.any(`SELECT * FROM data LIMIT 10 OFFSET 0`)
    .then(data => {
      const result = [`<ul>`];

      data.forEach(row => {
        result.push(`<li><a href="/list/${row.id}">${row.name}</a></li>`);
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
  const id = parseInt(req.params.id, 10);

  // id til að birta notanda, notum xss library til að koma í veg fyrir xss
  const displayId = xss(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.send(`<p>${displayId} er ekki gilt</p>`)
  }

  db.one(`SELECT * FROM data WHERE id = $1`, [id])
    .then(data => {
      res.send(`<dl>
  <dt>Nafn</dt>
  <dd>${data.name}</dd>
  <dt>Gögn</dt>
  <dd>${data.data}</dd>
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
    <label for="name">Nafn:</label>
    <input type="text" name="name" id="name">
  </div>
  <div>
    <label for="data">Gögn:</label>
    <textarea name="data" id="data"></textarea>
  </div>
  <button>Skrá</button>
</form>
`);
});

// POST item to database
router.post('/add', (req, res) => {
  const name = xss(req.body.name || '');
  const data = xss(req.body.data || '');

  db.none(`INSERT INTO data (name, data) VALUES ($1, $2)`, [name, data])
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
    console.log('EXIF DATA:\n' + result);
    console.log('IMAGE\n' + result.image.Make);
    res.render('index_kort');
  }, (error) => {
    console.log(error);
    res.render('error', {
      title: 'Oh no!',
      message: 'An unexpected error occured when making your request, '
             + 'perhaps you can try again later.' });
  });
});

module.exports = router;
