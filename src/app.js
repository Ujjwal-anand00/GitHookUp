const express = require('express');
const app = express();

// it will handle only get call to the /user endpoint
app.get("/user",(req,res)=>{
    res.send({FirstName:"Ujjwal", LastName: "Anand"}); 
})
// it will handle only post call to the /user endpoint
app.post("/user",(req,res)=>{
    console.log("Save data to the database");
    res.send("User data saved");
});
// it will handle only delete call to the /user endpoint
app.delete("/user",(req,res)=>{
    // delete user data from the database
    res.send("User data deleted");
});

app.use("/test",(req,res)=>{
    res.send("Hello from the user");

});
app.listen(3000 , () => {
    console.log('Server is running on port 3000');
});