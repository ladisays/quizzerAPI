var mongoose = require('../config/config');

var Schema = mongoose.Schema;

var quizSchema = Schema ({
  title: String,
  description: String,
  category: String
});

var quizModel = mongoose.model('quiz', quizSchema);



module.exports = quizModel;