// TODO: Set up your Mongoose connection here.
const mongoose = require('mongoose');

const url = 'mongodb://localhost/reddit-db';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected successfully to database'))
  .catch(err => console.error('MongoDB connection Error:', err));

mongoose.set('debug', true);

module.exports = mongoose.connection;