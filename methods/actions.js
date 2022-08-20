var User = require("../models/user");
var turban = require("../models/turban.js");
var config = require("../config/dbconfig.js");
var jwt = require("jwt-simple");

const functions = {
  addNew: function (req, res) {
    if (req.body.name)
      if (!req.body.name || !req.body.email || !req.body.password) {
        res.json({ success: false, msg: "Enter all fields" });
      } else {
        var newUser = User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });

        newUser.save(function (err, newUser) {
          if (err) {
            if (err.code === 11000) {
              return res.json({
                success: false,
                msg: "This Email or username is already exist please try to Login",
              });
            }
            res.json({ success: false, msg: "Failed to save" });
            console.log(err);
          } else {
            res.json({ success: true, msg: "Successfully saved" });
          }
        });
      }
  },
  authenticate: function (req, res) {
    User.findOne(
      { name: req.body.name,
        email: req.body.email
      },
      function (err, user) {
        if (err) throw err;
        if (!user) {
          res.status(403).send({
            success: false,
            msg: "Authentication Failed, User not found",
          });
        } else {
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              var token = jwt.encode(
                { _id: user._id, name: user.name, email: user.email, id: user.id },
                config.secret
              );
              res.json({ success: true, token: token });
            } else {
              return res.status(403).send({
                success: false,
                msg: "Authentication failed, wrong password",
              });
            }
          });
        }
      }
    );
  },
  getinfo: function (req, res) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      var token = req.headers.authorization.split(" ")[1];
      var decodedtoken = jwt.decode(token, config.secret);
      return res.json({ success: true, msg: "Hello " + decodedtoken.name });
    } else {
      return res.json({ success: false, msg: "No Headers" });
    }
  },
};

module.exports = functions;
