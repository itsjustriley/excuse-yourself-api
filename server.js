require('dotenv').config();

const express = require('express');
const checkAuth = require('./middleware/checkAuth');
var cookieParser = require('cookie-parser');

const app = express();

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator());
app.use(cookieParser());

require('./data/db');

app.use(checkAuth);


// TODO: Add each controller here, after all middleware is initialized.


app.listen(3000, () => {
    console.log('API listening on port http://localhost:3000!');
  });

module.exports = app;
