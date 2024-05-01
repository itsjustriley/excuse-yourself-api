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
app.use(express.json());

require('./data/db');

app.use(checkAuth);
require ('./controllers/auth')(app);

const excuses = [
  "I forgot",
  "I didn't know",
  "I didn't understand",
  "I didn't care",
  "I didn't think",
  "I was too busy",
  "I was sick",
  "My dog ate it",
  "I was on vacation",
  "I was at a conference",
  "I was at a doctor's appointment",
  "I was at a funeral",
  "I was at a wedding",
  "My cat was sick",
  "My car broke down",
]



// TODO: Add each controller here, after all middleware is initialized.

app.get('/excuses', (req, res) => {
  const excuse = excuses[Math.floor(Math.random() * excuses.length)];
  res.json({ excuse });
});



app.listen(3000, () => {
    console.log('API listening on port http://localhost:3000!');
  });

module.exports = app;
