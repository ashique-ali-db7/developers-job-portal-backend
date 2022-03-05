var db = require("../config/connection");
var collections = require("../config/collection");
var objectId = require("mongodb").ObjectId;
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

module.exports = {
  userSignupVerification: (data) => {
    return new Promise(async (resolve, reject) => {
      let result = {};
      let emailExist = await db
        .get()
        .collection(collections.USERS_DETAILS_COLLECTION)
        .findOne({ email: data.email });

      if (emailExist) {
        result.emailExist = true;
        resolve(result);
      } else {
        let otp = Math.floor(1000 + Math.random() * 9000);
        data.otp = otp;

        let exist = await db
          .get()
          .collection(collections.EMAIL_VERIFICATION)
          .findOne({ email: data.email });
        if (exist) {
          db.get()
            .collection(collections.EMAIL_VERIFICATION)
            .deleteOne({ _id: exist._id });
        }

        db.get().collection(collections.EMAIL_VERIFICATION).insertOne(data);

        result.emailExist = false;
        result.otp = otp;
        result.email = data.email;
        resolve(result);
      }
    });
  },

  otpVerification: (data, email) => {
    data.otpnumber = Number(data.otpnumber);

    return new Promise(async (resolve, reject) => {
      let result = {};
      let verification = await db
        .get()
        .collection(collections.EMAIL_VERIFICATION)
        .findOne({ email: email, otp: data.otpnumber });

      if (verification) {
        delete verification.otp;
        let salt = await bcrypt.genSalt(10);
        verification.password = await bcrypt.hash(verification.password, salt);
        db.get()
          .collection(collections.USERS_DETAILS_COLLECTION)
          .insertOne(verification);
        db.get()
          .collection(collections.EMAIL_VERIFICATION)
          .deleteMany({ email: email });
        result.verification = true;
        resolve(result);
      } else {
        result.verification = false;
        resolve(result);
      }
    });
  },

  siginCheck: (data) => {
    return new Promise(async (resolve, reject) => {
      let result = {};
      let user = await db
        .get()
        .collection(collections.USERS_DETAILS_COLLECTION)
        .findOne({ email: data.email });

      if (user) {
        bcrypt.compare(data.password, user.password).then((status) => {
          if (status) {
            result.token = generateToken(user._id);
            result.user = user;
            result.exist = true;
            resolve(result);
          } else {
            result.exist = false;
            resolve(result);
          }
        });
      } else {
        result.exist = false;
        resolve(result);
      }
    });
  },

  googleVerification: (email) => {
    return new Promise(async (resolve, reject) => {
      let result = {};
      let user = await db
        .get()
        .collection(collections.USERS_DETAILS_COLLECTION)
        .findOne({ email: email });

      if (user) {
        result.token = generateToken(user._id);
        result.exist = true;
        result.user = user;
        resolve(result);
      } else {
        result.exist = false;
        resolve(result);
      }
    });
  },
  uploadProfile: (allData, profileImgUrl, verificationImgUrl) => {
    console.log("hmm");
    if (profileImgUrl) {
      allData.profileImage = profileImgUrl;
    }
    if (verificationImgUrl) {
      allData.verificationImage = verificationImgUrl;
      allData.status = "Available";
      allData.earnings = 0;
    }
    
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_DETAILS_COLLECTION)
        .updateOne({ _id: objectId(allData.userId) }, { $set: { ...allData } })
        .then(async () => {
          let result = await db
            .get()
            .collection(collections.USERS_DETAILS_COLLECTION)
            .findOne({ _id: objectId(allData.userId) });
          console.log(result);
          resolve(result);
        });
    });
  },
  allUsers: async (sample,number) => {
    let skipValue = number - 9
    let users = await db
      .get()
      .collection(collections.USERS_DETAILS_COLLECTION)
      .find({}).skip(skipValue).limit(Number(number))
      .toArray();
      console.log(users);
    sample(users);
  },
  paginationCount:()=>{
   
return new Promise(async(resolve,reject)=>{
  let result =await db.get().collection(collections.USERS_DETAILS_COLLECTION).count();

  resolve(result)
})
  }
};
