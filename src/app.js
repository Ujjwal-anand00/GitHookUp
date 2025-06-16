const express = require('express');
const connectDB = require('./config/DataBase');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup" , async(req , res) => {
    const user = new User(req.body); 
    // const user  = new User({
    //     firstName : "MS",
    //     lastName : "Dhoni",
    //     emailId : "MSdhoni@gmail.com",
    //     password  : "MSDhoni",
    // });

    try{
        await user.save();
        res.send("User added sucessfully !!!!");
    }catch(err){
        res.status(400).send("Error Saving the user :"+ err.massage);
    }

    
});

// Get user by email
app.get("/user" ,async (req,res) => {
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({emailId : userEmail});
        if(!user){
            res.status(404).send("User not found !!");
        }
        else{
            res.send(user);
        }
        
        
    }catch(err){
        res.status(400).send("Something went WRONG!!!!");
    }
});

// Get feed -> get all the users from the database

app.get("/feed" , async (req , res) => {
    try{
        const user = await User.find({});
        if(user.length === 0){
            res.status(404).send("User not found !!");
        }
        else{
            res.send(user);
        }

    }catch(err){
         res.status(400).send("Something went WRONG!!!!");
    }
    
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
