const express = require('express');
const app = express();

const {adminAuth , userAuth} = require("./Middleware/Auth");

app.use("/admin",adminAuth);

app.post("/user/login" , (req,res)=>{
    res.send("Login Successfully !");
});

app.get("/user",userAuth,(req,res)=>{
    res.send("User data sent");
})


app.get("/admin/getAllData" , (req,res)=>{
    res.send("All data sent");
});
app.get("/admin/deleteAllData",(req,res)=>{
    res.send("All data Delete");
});

app.listen(3000 , () => {
    console.log('Server is running on port 3000');
});