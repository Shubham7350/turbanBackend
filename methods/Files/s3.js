require("dotenv").config();
import S3 from "aws-sdk/clients/s3";
import { createReadStream } from "fs";

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

import v4 from "uuid";

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});
// UPLOAD FILE TO S3
function uploadFile(file) {
  const fileStream = createReadStream(file.path);
  let theFileName = file.filename.split(".")
  let fileExtension = theFileName[theFileName.length - 1]
  theFileName.pop()
  theFileName.join(".")
  theFileName += "-"+v4()
  theFileName += fileExtension
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
return s3.upload(uploadParams).promise(); // this will upload file to S3
}
export default { uploadFile };