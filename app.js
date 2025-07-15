const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./src/routes/user");
const { profileRouter } = require("./src/routes/profile");
const { connectionRouter } = require("./src/routes/connection");
const { connectDB } = require("./src/config/database");

app.use(
  cors({
    origin: "http://localhost:5173",
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

connectDB()
  .then(() => {
    console.log("====================================");
    console.log("Database connection establish successfully!");
    console.log("====================================");

    app.listen(process.env.PORT, () => {
      console.log("Server started at port : ", process.env.PORT);
    });
  })
  .catch((e) => {
    console.log("====================================");
    console.log("Error : ", e);
    console.log("====================================");
  });
