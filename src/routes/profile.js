const express = require("express");
const {  UserModel } = require("../models/user");
const { verifyToken } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.use(verifyToken);

// This api is for updating user details
profileRouter.patch("/profile/update", async (req, res) => {
  try {
    const userId = req.user._id;

    const ALLOWED_UPDATE = [
      "firstName",
      "lastName",
      "gender",
      "age"
    ];
    const isAllowed = Object.keys(req.body).every((key) => {
      return ALLOWED_UPDATE.includes(key);
    });
    if (!isAllowed) {
      throw new Error("EmailId update in not allowed!");
    }
    const user = await UserModel.findByIdAndUpdate(userId, req.body, {
      returnDocument: "before",
      runValidators: true,
    });
    if (!user) {
      throw new Error("Not valid user !");
    }
    res.status(200).json({
      user: user,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

// This api is for deleting user details
profileRouter.delete("/profile/delete", async (req, res) => {
  const userId = req.params.id;

  try {
    const user=await UserModel.findByIdAndDelete(userId);
    if(!user) {
      throw new Error("User not found!");
    }
    res.status(200).json({
      message: "User deleted successfully!",
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
});

// This api is for getting user details
profileRouter.get("/profile", async (req, res) => {
  const userId = req.user._id;

  try {
    const user=await UserModel.findById(userId);
    if(!user) {
      return res.status(401).json({
        message:"No user found"
      })
    }
    res.status(200).json({
      message:"User profile!",
      user:user
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

module.exports = { profileRouter };
