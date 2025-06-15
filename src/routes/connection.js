const express = require("express");
const { ConnectionRequestModel } = require("../models/connection");
const { verifyToken } = require("../middlewares/auth");
const connectionRouter = express.Router();

connectionRouter.use(verifyToken);
connectionRouter.post("/user/send/:status/:toUserId", async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params?.toUserId;

    const allowedStatus = ["ignored", "interested"];
    const status = req.params?.status;
    let isValidStatus = true;
    if (!allowedStatus.includes(status)) {
      isValidStatus = false;
    }
    if (!isValidStatus) {
      throw new Error("Invalid status detected!");
    }
    const isExistRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (isExistRequest) {
      throw new Error("Request is already sent!");
    }

    const request = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    await request.save();

    res.status(200).json({
      message: "Request was sent successfully!",
      request,
    });
  } catch (e) {
    res.status(400).json({
      error: "Error : " + e.message,
    });
  }
});
module.exports = { connectionRouter };
