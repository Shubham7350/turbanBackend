var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
  imgLink: String,
  turbanName: String,
  description: String,
  infolink: String,
  longitude: String,
  latitude: String
});

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
