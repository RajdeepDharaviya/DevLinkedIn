const { Server } = require("socket.io");

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
    socket.on("joinChat", (targetUserId, userId, firstName) => {
      const roomId = [targetUserId, userId].sort().join("_");
      socket.join(roomId);
    });

    // This event is for sending a message
    socket.on("sendMessage", (targetUserId, userId, firstName, message) => {
      const roomId = [targetUserId, userId].sort().join("_");
      io.to(roomId).emit("messageReceived", firstName, message);
    });

    // This event is for disconnecting a socket
    socket.on("disconnect", () => {});
  });
};

module.exports = { initializeSocket };
