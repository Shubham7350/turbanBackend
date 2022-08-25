const S3 = require("aws-sdk/clients/s3.js")
const {s3Secret} = require("../../config/secret.js");
const {v4} = require("uuid");
const fs = require("fs");
const Post = require("../../models/posts.js");
const { db } = require("../../models/posts.js");

const s3 = new S3({
    region: s3Secret.AWS_REGION,
    accessKeyId: s3Secret.AWS_ACCESS_KEY_ID,
    secretAccessKey: s3Secret.AWS_SECRET_ACCESS_KEY,
  });

const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: s3Secret.AWS_BUCKET_NAME,
        Body: fileStream,
        Key: file.originalname,
        ACL:'public-read'
    };
    return s3.upload(uploadParams).promise(); // this will upload file to S3
}

module.exports.fileUpload = async(req,res,next) => {
    console.log(req.file)
    let theFileNameToDelete = req.file.filename

    let theFileName = req.file.originalname.split(".")
    let fileExtension = theFileName[theFileName.length - 1]
    theFileName.pop()
    theFileName.join(".")
    theFileName += "_"+v4()
    theFileName += "."+fileExtension

    req.file.originalname = theFileName

    uploadFile(req.file)
    .then((response)=>{
        //deleting multer temp file
        fs.rm("uploads/"+theFileNameToDelete, { recursive:true }, (err) => {
            if(err){
                // File deletion failed
                console.error(err.message);
            }
            console.log("File deleted successfully");
        })
        res.status(201)
        let fileLink = response.Location
        console.log("File Stored Attt >> "+response.Location);
        var singlePost = {
            photoLink: ""+response.Location
        };
        db.collection('posts').insertOne(singlePost, function(err, res) {
            if (err) throw err;
            console.log("1 post inserted");
           // db.close();
          });
            return res.json({
                link: fileLink,
                message: "success"
            });
         
        
    })
    .catch((err)=>{
        res.status(500)
        return res.json(err)
    })
}
