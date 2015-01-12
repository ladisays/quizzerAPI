var mongoose = require('../config/config');

var Schema = mongoose.Schema;

var questionSchema = Schema ({
  quiz_id: Schema.Types.ObjectId,
  name: String,
  answer: String,
  wrong_answers: [String]
});

var questionModel = mongoose.model('question', questionSchema);


module.exports = questionModel;