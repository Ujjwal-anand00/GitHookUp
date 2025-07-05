const express = require("express");
const connectDB = require("./config/DataBase");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./Middleware/Auth");

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

    const isPasswordIsValid = await user.validatePassword(password);

    if (isPasswordIsValid) {
      // create a JWT token

      const token = await user.getJWT();

      // Add JWT token to cookies and send the response to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login Successfully !!");
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Sending connection request ");
  res.send(user.firstName + " sent the connection request !!!");
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
