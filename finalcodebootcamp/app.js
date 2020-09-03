// require('dotenv').config();
// const express=require('express');
// var app=express();
// const userRouter=require('./api/users/users.router');
// //app.use(express.json());
// app.use("/api/users",userRouter);
// app.listen(process.env.APP_PORT,()=>{
//     console.log("app listening on port"+process.env.APP_PORT);
//     });
require("dotenv").config();
const express=require('express');
var app=express();


const userRouter=require('./api/users/users.router');
app.use(express.json());
app.use("/api/users",userRouter);

global.__basedir = __dirname;

var path = require('path');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//require('./api/users/users.router')(app1, passport);

app.listen(process.env.APP_PORT,()=>{
console.log("app listening on port"+process.env.APP_PORT);
});

//D:\final\finalcodebootcamp\api\users\users.router.js