const express = require("express");
const router = express.Router();
const userHelpers = require("../helpers/userHelper");
const adminHelpers = require("../helpers/adminHelper");


router.route("/adminLogin").post((req, res) => {
    adminHelpers.adminLogin(req.body).then((response)=>{
       if(response.ok){
           res.status(200);
           res.json({token:response.token})
       }else{
        
        res.status(403);
        res.json({message:response.token})
          
           
       }
    })
});

module.exports = router;
