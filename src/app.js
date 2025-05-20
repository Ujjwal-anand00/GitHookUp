const express = require('express');
const app = express();
app.use("/",(req,res)=>{
    res.send("Hello Ujjwal");

});
app.use("/hello",(req,res)=>{
    res.send("Hello Hello Hello");

});

app.use("/hi",(req,res)=>{
    res.send("Hello , HI");

});
app.use((req,res)=>{
    res.send("Hello from the server");

});
app.listen(3000 , () => {
    console.log('Server is running on port 3000');
});