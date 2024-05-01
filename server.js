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

const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', 'views');



// TODO: Add each controller here, after all middleware is initialized.

app.get('/', (req, res) => {
  res.render('home', { layout: 'main' });
});

app.listen(3000, () => {
    console.log('API listening on port http://localhost:3000!');
  });

module.exports = app;
