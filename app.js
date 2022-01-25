
const express = require('express');
const app = express();
const userRoute = require('./routes/userRouter');
const adminRoute = require('./routes/adminRouter');
var db = require('./config/connection');


db.connect((err)=>{
    if(err) console.log("Databse connection error"+err)
    else console.log("database is connected")
    });
    

app.use('/',userRoute);
app.use('/admin',adminRoute);



app.listen(3001,(error)=>{
    if(!error){
        console.log("server is running");
    }
    else{
        console.log("server is not running")
    }
})

module.exports = app;