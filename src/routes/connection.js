const express = require("express");
const { ConnectionRequestModel } = require("../models/connection");
const { verifyToken } = require("../middlewares/auth");
const { UserModel } = require("../models/user");
const connectionRouter = express.Router();
connectionRouter.use(verifyToken);
const USER_SAFE_DATA = "firstName lastName emailId age gender skills";

connectionRouter.use(verifyToken);

// This api is for sending a request
connectionRouter.post("/request/send/:status/:toUserId", async (req, res) => {
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

// This api is for accepting or rejecting the request
connectionRouter.post(
  "/request/received/:status/:requestId",
  async (req, res) => {
    try {
      const status = req.params.status;
      const requestId = req.params.requestId;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(401)
          .json({ message: "Invalid status request detected!" });
      }
      const connRequest = await ConnectionRequestModel.findById(requestId);

      connRequest.status = status;
      await connRequest.save();
      res.status(200).json({
        message: "Request " + status + " successfully!",
      });
    } catch (e) {
      res.status(400).json({
        error: "Error : " + e.message,
      });
    }
  }
);

// This api is for getting all the connection those are accepted
connectionRouter.get("/connections", async (req, res) => {
  const userId = req.user._id;
  const connections = await ConnectionRequestModel.find({
    $and: [
      { $or: [{ toUserId: userId }, { fromUserId: userId }] },
      { status: "accepted" },
    ],
  })
    .populate("fromUserId", [
      "firstName",
      "lastName",
      "emailId",
      "gender",
      "skills",
    ])
    .populate("toUserId", [
      "firstName",
      "lastName",
      "emailId",
      "gender",
      "skills",
    ]);

  const connectionData = connections.map((connection) => {
    if (connection.fromUserId._id.toString() === userId.toString()) {
      return connection.toUserId;
    }
    return connection.fromUserId;
  });
  if (!connections) {
    return res.status(200).json({
      message: "You don't have any connection!",
    });
  }
  res.status(200).json({
    message: "Your connections",
    users: connectionData,
  });
});

// This api is for received requests from other users
connectionRouter.get("/requests/received", async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await ConnectionRequestModel.find({
      $and: [{ $or: [{ toUserId: userId }] }, { status: "interested" }],
      // status:"interested"
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "emailId",
      "gender",
      "skills",
    ]);

    if (!requests) {
      return res.status(200).json({
        message: "You don't have any pending requests!",
      });
    }
    res.status(200).json({
      message: "Your requests!",
      requests: requests,
    });
  } catch (e) {
    res.status(400).json({
      error: "Error : " + e.message,
    });
  }
});

// This api is for getting all users
connectionRouter.get("/feed", async (req, res) => {
  try {
    const page = req.query.page || 1;
    let limit = req.query.limit || 5;
    limit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * limit;

    const userId = req.user._id;
    const usersConnections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).select("toUserId fromUserId");

    const hideFromUser = new Set();

    usersConnections.forEach((connection) => {
      hideFromUser.add(connection.toUserId);
      hideFromUser.add(connection.fromUserId);
    });

    const users = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideFromUser) } },
        { _id: { $ne: userId } },
      ],
    }).select(USER_SAFE_DATA);
    // .skip(skip)
    // .limit(limit);

    if (users.length !== 0) {
      return res.status(200).json({
        users: users,
      });
    } else {
      return res.status(200).json({
        message: "No users existed!",
      });
    }
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

module.exports = { connectionRouter };
