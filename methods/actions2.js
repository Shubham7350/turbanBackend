var vendor = require("../models/vendor.js");
var jwt = require("jwt-simple");
var jwt1 = require("jsonwebtoken");
var config = require("../config/dbconfig");
const _ = require("lodash");
const sgMail = require("@sendgrid/mail");

var functions = {
  addNew: function (req, res) {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.shopName ||
      !req.body.address ||
      !req.body.phone
    ) {
      res.json({ success: false, msg: "Enter all fields" });
    } else {
      var newvendor = vendor({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        shopName: req.body.shopName,
        address: req.body.address,
        phone: req.body.phone,
        products: req.body.products,
      });

      newvendor.save(function (err, newvendor) {
        if (err) {
          if (err.code === 11000) {
            return res.json({
              success: false,
              msg: "This vendor is already exist please try to Login",
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
    vendor.findOne(
      {
        email: req.body.email,
      },
      function (err, vendor) {
        if (err) throw err;
        if (!vendor) {
          res.status(403).send({
            success: false,
            msg: "Authentication Failed, Vendor not found",
          });
        } else {
          vendor.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              var token = jwt.encode(
                {
                  _id: vendor._id,
                  name: vendor.name,
                  email: vendor.email,
                  id: vendor.id,
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
      // jwt.verify(resetLink, "secret");
      var decodedtoken = jwt.decode(token, config.secret);
      // if(resetLink){
      return res.json({ success: true, msg: "Hello " + decodedtoken.name });
    } else {
      return res.json({ success: false, msg: "No Headers" });
    }
  },

  forgotPassword: function (req, res) {
    const email2 = req.body;

    vendor.findOne({ email2 }, (err, vendor) => {
      if (err || !vendor) {
        return res
          .status(400)
          .json({ error: "Vendor with this email does not exit" });
      }
      const token = jwt1.sign(
        {
          _id: vendor._id,
        },
        "secret"
        // {
        //     expiresIn: "10m"
        // }
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
              <p>https://turban-forget.herokuapp.com/reset-password</p>
              
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

      return vendor.updateOne({ resetLink: token }, function (err, success) {
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
  resetPassword: function (req, res) {
    const { email1 } = req.body;

    vendor.findOne({ email1 }, (error, vendor) => {
      if (error || !vendor) {
        return res
          .status(400)
          .json({ error: "Vendor with this email does not exit" });
      }
      const { newPass } = req.body;
      const obj = {
        password: newPass,
        resetLink: "",
      };
      vendor = _.extend(vendor, obj);
      vendor.save((err, result) => {
        if (err) {
          return res.status(400).json({ error: "reset password error" });
        } else {
          return res.status(200).json({ message: "password has been change" });
        }
      });
    });
  },
};

module.exports = functions;
