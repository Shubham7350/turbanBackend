const {Router} = require("express");
const multer = require("multer");
const {fileUpload} = require("./FileController.js");
const multerFilesUpload = multer({ dest: 'uploads/' })

const router = Router();

router.post(
  "/upload",
  [
    multerFilesUpload.single("file")
  ],
  fileUpload
);

module.exports.FileRoute = router;