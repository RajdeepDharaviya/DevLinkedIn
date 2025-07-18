const express = require("express");
const { signInToken } = require("../middlewares/auth");
const { validateData, validateSignIn } = require("../utils/validation");
const { hashPassword, checkPassword } = require("../utils/hashing");
const { UserModel } = require("../models/user");

const authRouter = express.Router();

// This api is for adding user or signup
authRouter.post("/signup", validateData, async (req, res) => {
  // This function is for hashing of password
  const hashedPassword = await hashPassword(req.body.password);

  const user = new UserModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailId: req.body.emailId,
    password: hashedPassword.toString(),
    age: req.body.age,
    gender: req.body.gender,
  });

  try {
    const newUser = await user.save();
    const token = await signInToken(newUser._id);

    res.cookie("token", token, {
      path: "/", // default path
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiry
      httpOnly: false, // based on your needs
    });

    res.status(200).json({
      message: "User Created successfully",
      user: newUser,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

// This api is for signing user
authRouter.post("/signin", validateSignIn, async (req, res) => {
  // This function is checking data is valid or not
  // validateSignIn(req.body);
  try {
    // Checking a email id
    const isUserExist = await UserModel.findOne({ emailId: req.body.emailId });

    if (!isUserExist) {
      return res.status(400).json({ message: "Email id is not match!" });
    }

    // This function is for hashing of password
    const isValidPassword = await checkPassword(
      req.body.password,
      isUserExist.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "password is not match!" });
    }

    const token = await signInToken(isUserExist._id);
    res.cookie("token", token, {
      path: "/", // default path
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiry
      httpOnly: false, // based on your needs
    });

    res.status(200).json({
      user: isUserExist,
    });
  } catch (e) {
    res.status(400).json({
      error: "Error : " + e.message,
    });
  }
});

// This api is for logout
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    path: "/", // MUST match
  });

  res.send("Logout successfully!");
});

module.exports = { authRouter };
