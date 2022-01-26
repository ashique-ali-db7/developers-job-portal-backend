
const express = require('express')
const router = express.Router();
const userHelpers = require('../helpers/userHelper');
const adminHelpers = require('../helpers/adminHelper');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const nodemailer = require('nodemailer');
const env = require('../config/env');
const { response } = require('express');
 







router.route('/')
.get((req,res)=>{
    
});


router.route('/signup')
.post((req,res)=>{
   
    userHelpers.userSignupVerification(req.body).then((response)=>{
    if(response.exist){
        console.log("idh scene");
        res.status(409);
        res.json({message:"Entered user already exist"})
       
       
    }else{

         let transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            
            user: env.userEmail,
             pass: env.mailPassword
        }
    });
    
    
    
    let mailOptions = {
        from:env.userEmail,
        to:req.body.email,
        subject:'Developers hub',
        text:'Your otp verification number is '+response.otp
    }
    
    
    transporter.sendMail(mailOptions,function(err,data){
        if(err){
            console.log('error occurs'+err);
        }else{
            console.log('email sent');
        }
    })

res.status(200);


    }
})

  




})


module.exports = router;