const { Server } = require("socket.io");
const { ConnectionRequestModel } = require("../models/connection");
const { ChatModel } = require("../models/chat");

const initializeSocket = (server) => {
  let io = null;

  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://192.168.227.127:5173"],
    },
  });

  // Creating a connection through socket
  io.on("connection", (socket) => {
    // Handling a socket events here

    // This event is for creating a room
    socket.on("joinChat", async (targetUserId, userId) => {
      try {
        // Checking that if user and target user are connected or not
        const connection = await ConnectionRequestModel.find({
          $and: [
            {
              $or: [
                { fromUserId: userId, toUserId: targetUserId },
                { fromUserId: targetUserId, toUserId: userId },
              ],
            },
            { status: "accepted" },
          ],
        });
        if (!connection) {
          return res.status(402).json({
            message: "Something wrong with ReceiverId",
          });
        }
        const roomId = [targetUserId, userId].sort().join("_");
        socket.join(roomId);
      } catch (err) {
        return res.status(400).json({
          message: "Error : " + err.message,
        });
      }
    });

    // This event is for sending a message
    socket.on(
      "sendMessage",
      async (targetUserId, userId, firstName, message) => {
        try {
          const roomId = [targetUserId, userId].sort().join("_");
          let chat = await ChatModel.findOne({
            participants: { $all: [targetUserId, userId] },
          });

          if (!chat) {
            chat = new ChatModel({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text: message,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", firstName, message);
        } catch (error) {}
      }
    );

    // This event is for disconnecting a socket
    socket.on("disconnectSocket", () => {
      socket.disconnect();
    });
  });
};

module.exports = { initializeSocket };
