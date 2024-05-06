if (!process.env.PORT) {
  require("dotenv").config()
}

const port = process.env.PORT || 5000;


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


require ('./controllers/auth')(app);
require ('./controllers/excuse')(app);

app.use(express.static('docs')); 

app.get('/', (req, res) => {
  res.sendFile('/docs/index.html'); 
});




// app.listen(3000, () => {
//   console.log('API listening on port http://localhost:3000!');
// });

module.exports = app;
