var User = require("../models/user");
var config = require("../config/dbconfig.js");
var jwt = require("jwt-simple");
const sgMail = require("@sendgrid/mail");
var jwt1 = require("jsonwebtoken");

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
      { name: req.body.name, email: req.body.email },
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
                {
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  id: user.id,
                },
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
  logout: function (req, res) {
    res.redirect("/dashboard");
    console.log("logout");
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
  forgotPassword: function (req, res) {
    const email2 = req.body;

    User.findOne({ email2 }, (err, email) => {
      if (err || !email) {
        return res
          .status(400)
          .json({ error: "User with this email does not exit" });
      }
      const token = jwt1.sign(
        {
          _id: User._id,
        },
        "secret",
        {
          expiresIn: "20m",
        }
      );
      sgMail.setApiKey(
        "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"
      );

      const msg = {
        to: email2, // Change to your recipient
        from: "omkardkamble221@gmail.com", // Change to your verified sender
        subject: "testing API",
        text: "testing API with Shubham Ingole",
        html: `<h1>reset Password link </h1>
            <p>I</p>
            
             `,
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });

      return User.updateOne({ resetLink: token }, function (err, success) {
        if (err) {
          return res.status(400).json({ error: "reset password error  " });
        } else {
          return res.json({
            message: "Email has been sent, kindly follow instruction",
          });
        }
      });
    });
  },
};

module.exports = functions;
