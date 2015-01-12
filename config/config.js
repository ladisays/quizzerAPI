var mongoose = require('mongoose');
// connect to our local database
mongoose.connect('mongodb://localhost/quizzerAPI');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function (callback) {
  console.log('Connection successful!');
});

module.exports = mongoose;