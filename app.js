const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./src/routes/user");
const { profileRouter } = require("./src/routes/profile");
const { connectionRouter } = require("./src/routes/connection");
const { connectDB } = require("./src/config/database");
const http = require("http");
const { initializeSocket } = require("./src/utils/socketio");
const { chatRouter } = require("./src/routes/chat");

app.use(
  cors({
    origin: ["http://192.168.227.127:5173", "http://localhost:5173"],
    credentials: true,
  })
);
// require("./src/utils/cronjob");
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
app.use("/user", authRouter);
app.use("/user", profileRouter);
app.use("/user", connectionRouter);
app.use("/user", chatRouter);

// Creating a server for socket
const server = http.createServer(app);

// This function will handle a socket events and initialization
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("====================================");
    console.log("Database connection establish successfully!");
    console.log("====================================");

    server.listen(process.env.PORT, "0.0.0.0", () => {
      console.log("Server started at port : ", process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("====================================");
    console.log("Error : ", e);
    console.log("====================================");
  });
