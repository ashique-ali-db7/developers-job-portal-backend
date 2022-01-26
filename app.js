
var createError = require('http-errors');
const express = require('express');
const app = express();
var cors = require('cors')
const userRoute = require('./routes/userRouter');
const adminRoute = require('./routes/adminRouter');
var db = require('./config/connection');
require('dotenv').config();


app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

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