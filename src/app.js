const express = require('express');
const app = express();

app.use(
    "/user",
    (req,res,next) => {
        console.log("Handling the route /user");
        // res.send("1st Response");
        next();
    },
    (req,res,next)=>{
        console.log("Handling the route /user 2 !!");
        // res.send("2nd Response");
        next();
    },
    (req,res,next)=>{
        console.log("Handling the route /user 3 !!");
        // res.send("3rd Response");
        next();
    },
    (req,res,next)=>{
        console.log("Handling the route /user 4 !!");
        // res.send("4th Response");
        next();
    },
    (req,res,next)=>{
        console.log("Handling the route /user 5 !!");
        res.send("5th Response");
        // next();
    },

)

app.listen(3000 , () => {
    console.log('Server is running on port 3000');
});