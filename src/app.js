const express = require("express");
const connectDB = require("./config/DataBase");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const initializeSocket = require("./utils/socket");

require("dotenv").config();

const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");
const userRouter = require("./Routes/user");
const chatRouter = require("./Routes/chat");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static("public"));

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);

initializeSocket(server);



connectDB()
  .then(() => {
    console.log("Database is connected.....");

    server.listen(process.env.PORT, () => {
      console.log("Server is running on port " + process.env.PORT);
    });
  })
  .catch(() => {
    console.error("Database is not connected ......");
  });
