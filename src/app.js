const express = require('express');
const app = express();

// error handling
// app.use("/" , (err,req,res,next)=>{
//     if(err){
//         res.status(500).send("Something went wrong");
//     }

// });

app.get("/getUserData" , (req,res)=>{
    try{
        // logic of DB
        throw new Error("dzeft");
        res.send("User data sent");
    }
    catch(err){
        res.status(500).send("Something went wrong");

    }
});
app.use("/" , (err,req,res,next)=>{
    if(err){
        res.status(500).send("Something went wrong");
    }

});


app.listen(3000 , () => {
    console.log('Server is running on port 3000');
});