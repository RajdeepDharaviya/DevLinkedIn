const express = require("express");
const { signInToken } = require("../middlewares/auth");
const { validateData, validateSignIn } = require("../utils/validation");
const { hashPassword, checkPassword } = require("../utils/hashing");
const { userModel } = require("../models/user");

const authRouter = express.Router();

// This api is for adding user or signup
authRouter.post("/signup", async (req, res) => {
  // This function is checking data is valid or not
  validateData(req.body);

  // This function is for hashing of password
  const hashedPassword = await hashPassword(req.body.password);

  const user = new userModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailId: req.body.emailId,
    password: hashedPassword.toString(),
    age: req.body.age,
    gender: req.body.gender,
  });

  try {
    await user.save();
    res.status(200).json({
      message: "User Created successfully",
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

// This api is for signing user
authRouter.post("/signin", async (req, res) => {
  // This function is checking data is valid or not
  validateSignIn(req.body);

  // Checking a email id
  const isUserExist = await userModel.findOne({ emailId: req.body.emailId });

  if (!isUserExist) {
    res.status(203).json({ message: "Email id is not match!" });
    return;
  }

  // This function is for hashing of password
  const isValidPassword = await checkPassword(
    req.body.password,
    isUserExist.password
  );
  if (!isValidPassword) {
    res.status(203).json({ message: "password is not match!" });
    return;
  }

  try {
    const token = await signInToken(isUserExist._id);
    // res.cookie("token", token);
    res.status(200).json({
      user: isUserExist,
      token: token,
    });
  } catch (e) {
    res.status(400).json({
      error: "Error : " + e.message,
    });
  }
});
module.exports = { authRouter };
