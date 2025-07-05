const express = require("express");
const connectDB = require("./config/DataBase");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    // validation of data
    validateSignUpData(req);
    // Encrypt the password

    const passwordHash = await bcrypt.hash(password, 10);

    console.log(passwordHash);

    // creating new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added sucessfully !!!!");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!!");
    }

    const isPasswordIsValid = await bcrypt.compare(password, user.password);

    if (isPasswordIsValid) {
      // create a JWT token

      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");

      // Add JWT token to cookies and send the response to user
      res.cookie("token", token);

      res.send("Login Successfully !!");
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    // validate my cookies
    if(!token){
      throw new Error("Invalid token !!!");
    }

    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");

    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if(!user){
      throw new Error("User not found");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message); 
  }
});

// Get user by email

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found !!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went WRONG!!!!");
  }
});

// Get user by id

app.get("/userID", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("User not found !!!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("User not found");
  }
});

// Get feed -> get all the users from the database

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.status(404).send("User not found !!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went WRONG!!!!");
  }
});

// Delete user from database using _id

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully !!!");
  } catch (err) {
    res.status(400).send("Something went wrong !!!!");
  }
});

// Update data of the user

app.patch("/user/:userID", async (req, res) => {
  const userID = req.params?.userID;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["skills", "about", "gender", "age", "photoUrl"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed !!!!");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more then 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userID }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User Updated Successfully !!");
  } catch (err) {
    res.status(400).send("UPDATE FAILD : " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database is connected.....");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.error("Database is not connected ......");
  });
