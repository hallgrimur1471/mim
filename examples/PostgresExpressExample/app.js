const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const xss = require('xss');

const PORT = 3000;

const app = express();
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);

app.listen(PORT);
console.log(`Express started on port ${PORT}`);
