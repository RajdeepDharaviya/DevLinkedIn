const express = require("express");
const app = express();
const { userModel } = require("./src/models/user");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./src/routes/auth");
const { profileRouter } = require("./src/routes/profile");

app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
app.use(profileRouter);

// This api is for getting all users
app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find();
    if (users.length !== 0) {
      res.status(200).json({
        users: users,
      });
    } else {
      res.status(200).json({
        message: "No users existed!",
      });
    }
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
});

app.listen(3000, () => {
  console.log("Server started at port : 3000");
});
