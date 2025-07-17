const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connection");
const { ChatModel } = require("../models/chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUserId = req.params.targetUserId;

    const chat = await ChatModel.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new ChatModel({
        participants: { $all: [userId, targetUserId] },
      });
    }

    await chat.save();

    res.status(200).json({
      chat,
    });
  } catch (error) {}
});

module.exports = { chatRouter };
