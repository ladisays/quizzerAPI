var mongoose = require('../config/config');

var Schema = mongoose.Schema;

var categorySchema = Schema ({
  _id: Number,
  name: String
});

var categoryModel = mongoose.model('category', categorySchema);


module.exports = categoryModel;