var mongoose = require('mongoose');

// define the schema for our question model
var questionSchema = mongoose.Schema({

  user_id: mongoose.Schema.Types.ObjectId,
  tag: String,
  name: String,
  answer: String,
  wrong_answers: [{value: String}]
});


module.exports = mongoose.model('question', questionSchema);