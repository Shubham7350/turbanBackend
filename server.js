const express = require("express");
const connectDB = require("./config/db");
const Turban = require("./models/turban.js");
const app = express();
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const morgan = require("morgan");

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);
app.use(passport.initialize());
require("./config/passport")(passport);
connectDB();

app.get("/", async (req, res) => {
  res.json({
    message: " all turban ",
  });
});

// for getting info of all turbans ** using in google map
app.get("/turbans", async (req, res) => {
  const turbans = await Turban.find();
  return res.send(turbans);
});

app.get("/turbans/popular", async (req, res) => {
  const turban = await Turban.find({ popular: true }).exec();
  return res.send(turban);
});

app.get("/turbans/:id", async (req, res) => {
  const turban = await Turban.findById(req.params.id);
  return res.send(turban);
});

app.post("/turban/create", async (req, res) => {
  const turban = new Turban({
    turbanName: req.body.turbanName,
    description: req.body.description,
    infoLink: req.body.infoLink,
  });
  await turban.save();
  return res.send(turban);
});

// app.get("/turban/location", async(req, res) =>{
//   const turban = await Turban.find({location: ""});
//   return res.send(turban);
// });

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
