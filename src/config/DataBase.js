const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect(
    "mongodb+srv://ujjwalanand:S5wS6ciE95ouGjeU@ujjwal.md66yb2.mongodb.net/"
    );
};

module.exports = connectDB;



