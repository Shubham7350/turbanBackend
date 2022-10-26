var mongoose = require("mongoose");
var ytLinkSchema = new mongoose.Schema({
  link: String,
});

module.exports = mongoose.model("Ytlinks", ytLinkSchema);
