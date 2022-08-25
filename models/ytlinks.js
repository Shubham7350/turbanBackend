var mongoose = require("mongoose");
// var Schema = mongoose.Schema;
var ytLinkSchema = new mongoose.Schema({
  link: String
});

module.exports = mongoose.model('Ytlinks', ytLinkSchema)