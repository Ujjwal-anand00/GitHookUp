const express = require('express');
const connectDB = require('./config/DataBase');
const app = express();

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
