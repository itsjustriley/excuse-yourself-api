// TODO: Set up your Mongoose connection here.
const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.DB_URL;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected successfully to database'))
  .catch(err => console.error('MongoDB connection Error:', err));

mongoose.set('debug', true);

module.exports = mongoose.connection;