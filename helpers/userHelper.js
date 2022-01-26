var db = require('../config/connection');
var collections = require('../config/collection');
var objectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

module.exports = {

    userSignupVerification:(data)=>{
             return new Promise(async(resolve,reject)=>{
                 
                   let result = {}
                 let emailExist = await db.get().collection(collections.USERS_DETAILS_COLLECTION).findOne({email:data.email});

                 if(emailExist){
                  result.emailExist = true;
                  resolve(result)
                 }
                 else{
                    let otp = Math.floor(1000 + Math.random() * 9000);
                    data.otp = otp;
                    db.get().collection(collections.EMAIL_VERIFICATION).insertOne(data)
                    result.emailExist = false;
                    result.otp = otp
                    resolve(result);
                 }

             })
    }


}