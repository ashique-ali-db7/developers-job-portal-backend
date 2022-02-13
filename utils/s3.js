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
async function uploadFile(files) {
  let result = {}
  const [profileImage,verificationImageUpload] = files;
  if(profileImage){
  const fileStreamProfile = fs.createReadStream(profileImage.path);
  const uploadProfileParams = {
    Bucket: bucketName,
    Body: fileStreamProfile,
    Key: profileImage.filename,
  };
  result.profileImage =await s3.upload(uploadProfileParams).promise();
}
if(verificationImageUpload){
  const fileStreamVerification = fs.createReadStream(verificationImageUpload.path);
  const uploadVerificationParams = {
    Bucket: bucketName,
    Body: fileStreamVerification,
    Key: verificationImageUpload.filename,
  };
  result.verificationImageUpload =await s3.upload(uploadVerificationParams).promise();
}


  return result;
}
exports.uploadFile = uploadFile;

//downloads files from s3

function getFileStream(fileKey, bucketName) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };
  return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;
