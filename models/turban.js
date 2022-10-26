var mongoose = require("mongoose");
var turbanDataSchema = new mongoose.Schema({
  // _id: Number,
  photo: String,
  turbanName: String,
  description: String,
  infoLink: String,
  popular: Boolean,
  location: String,
  longitude: String,
  lattitude: String,
});

module.exports = mongoose.model("Turban", turbanDataSchema);
