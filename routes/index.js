const express = require("express");
const actions = require("../methods/actions");
const actions2 = require("../methods/actions2");
const { FileRoute } = require("../methods/Files/FileRoute");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/dashboard", (req, res) => {
  res.send("Dashboard");
});

//@desc Adding new vendor with procucts
//@route POST /addvendor
router.post("/vendor/signUp", actions2.addNew);

//@desc Authenticate a vendor
//@route POST /authenticate
router.post("/vendor/authenticate", actions2.authenticate);

//@desc Get info on a vendor
//@route GET /getinfo
router.get("/vendor/getinfo", actions2.getinfo);

// @desc Get logout vendor
// @route Get /logout
router.get("/vendor/logout", actions2.logout);

//@desc forgetten Password for vendor
//@route PUT /forgotPassword
router.put("/vendor/forgot-password", actions2.forgotPassword);

//@desc reset Password for vendor
//@route PUT /resetPassword
router.post("/vendor/reset-password", actions2.resetPassword);

//@desc Adding new user
//@route POST /adduser
// router.post('/adduser', actions.addNew)
router.post("/signUp", actions.addNew);

//@desc Authenticate a user
//@route POST /authenticate
router.post("/authenticate", actions.authenticate);

router.put("/forgot-password", actions.forgotPassword);

//@desc Get info on a user
//@route GET /getinfo
router.get("/getinfo", actions.getinfo);

router.get("/logout", actions.logout);

router.use("/files", FileRoute);

module.exports = router;
