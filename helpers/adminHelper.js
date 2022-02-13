var db = require("../config/connection");
var collections = require("../config/collection");
var objectId = require("mongodb").ObjectId;
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

module.exports = {
    adminLogin:(data)=>{
        let values = {};
     return new Promise(async(resolve,reject)=>{
         let result = await db.get().collection(collections.ADMIN_VERIFICATION).findOne({name:data.name,password:data.password})
         console.log("lll");
         console.log(result);
         if(result){
             values.ok = true
          values.token =  generateToken(result._id);
          resolve(values)
         }else{
             values.ok = false;
        resolve(values)
         }
     })
    }

};
