const S3 = require("aws-sdk/clients/s3");
const env = require("../config/env");
const fs = require("fs");

const bucketName = env.AWS_BUCKET_NAME;
const region = env.AWS_BUCKET_REGION;
const accessKeyId = env.AWS_ACCESS_KEY;
const secretAccessKey = env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

//uploads a files to s3
function uploadFile(file) {
  console.log("sdsd");
  console.log(file.filename);
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

//downloads files from s3

function getFileStream(fileKey,bucketName){
    const downloadParams = {
        Key:fileKey,
        Bucket:bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream