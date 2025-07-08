const express = require("express");
const { userModel } = require("../models/user");
const { verifyToken } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.use(verifyToken);

// This api is for updating user details
profileRouter.patch("/user/profile/update", async (req, res) => {
  try {
    const userId = req.user.id;
    const ALLOWED_UPDATE = [
      "firstName",
      "lastName",
      "gender",
      "password",
      "skills",
    ];
    const isAllowed = Object.keys(req.body).every((key) => {
      return ALLOWED_UPDATE.includes(key);
    });
    if (!isAllowed) {
      throw new Error("EmailId update in not allowed!");
    }
    const user = await userModel.findByIdAndUpdate(userId, req.body, {
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
profileRouter.get("/profile", async (req, res) => {
  const userId = req.params.id;

  try {
    const user=await userModel.findByIdAndDelete(userId);
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

module.exports = { profileRouter };
