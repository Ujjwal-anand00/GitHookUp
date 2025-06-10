const express = require('express');
const connectDB = require('./config/DataBase');
const app = express();
const User = require('./models/user');


app.post("/signup" , async(req , res) => {
    const user  = new User({
        firstName : "Yashaswi",
        lastName : "Raj",
        emailId : "yashaswi@gmail.com",
        password  : "yashaswi@123",
    });
    await user.save();
    res.send("User added sucessfully !!!!");
})

connectDB()
    .then(() => {
        console.log("Database is connected.....");

        app.listen(3000 , () => {
        console.log('Server is running on port 3000');
        });

    })
    .catch(()=> {
        console.error("Database is not connected ......");
    });
