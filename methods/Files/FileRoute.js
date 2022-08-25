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

// router.get("/images", (req, res) =>{
//   res.send(multerFilesUpload.Location);
// })

module.exports.FileRoute = router;