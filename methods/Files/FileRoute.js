const { Router } = require("express");
const multer = require("multer");
const { fileUpload } = require("./FileController.js");
const multerFilesUpload = multer({ dest: "uploads/" });
const posts = require("../../models/posts.js");

const router = Router();

router.post("/upload", [multerFilesUpload.single("file")], fileUpload);

// router.get("/images", (req, res) =>{
//   res.send(db.collection('posts').find({photoLink}));
// })
router.get("/images", async (req, res) => {
  const images = await posts.find();
  return res.send(images);
});

module.exports.FileRoute = router;
