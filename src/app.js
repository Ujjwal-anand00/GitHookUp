const express = require("express");
const connectDB = require("./config/DataBase");
const app = express();
const cors = require("cors");

const cookieParser = require("cookie-parser");
const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");
const userRouter = require("./Routes/user");


app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/" , authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
