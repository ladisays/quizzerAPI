var mongoose = require('../config/config');

var Schema = mongoose.Schema;

// var questionSchema = Schema ({
//   quiz_id: Schema.Types.ObjectId,
//   name: String,
//   answer: String,
//   wrong_answers: [{value: String}]
// });

var questionSchema = Schema ({
  tag: String,
  name: String,
  answer: String,
  wrong_answers: [{value: String}]
});

var questionModel = mongoose.model('question', questionSchema);


module.exports = questionModel;