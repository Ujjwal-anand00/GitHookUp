const express = require('express');
const app = express();

// Handle auth middleware for all GET , POST , Delete

app.use("/admin",(req,res,next) => {
    console.log("Admin auth is getting checked !!");
    const token = "xyz";
    const isAdminAuthorized = token == "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized Request");
    }
    else{
        next();
    }
});

app.get("/user",(req,res)=>{
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