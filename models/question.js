var mongoose = require('mongoose');

// define the schema for our question model
var questionSchema = mongoose.Schema({

  user_id: mongoose.Schema.Types.ObjectId,
  tag: String,
  name: String,
  answer: String,
  wrongOptions: Array
});


module.exports = mongoose.model('question', questionSchema);