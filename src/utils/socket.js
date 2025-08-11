const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const connectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const socket = require("socket.io");
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`User ${firstName} joined room: ${roomId}`);

      onlineUsers.set(userId, socket.id);
      io.emit("updateUserStatus", { userId, status: "online" });

      socket.join(roomId);
      socket.userId = userId;
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, message }) => {
        // Save the message to the databse
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " sent a message: " + message);

          // Check if targetUserId and userId are friends
          connectionRequest
            .findOne({
              fromUserId: userId,
              toUserId: targetUserId,
              status: "accepted",
            })
            .then(async (friendship) => {
              if (!friendship) {
                console.log("Users are not friends");
                return;
              }
            });

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text: message,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            message,
          });
        } catch (err) {
          console.error("Error saving message:", err);
        }
      }
    );
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      let disconnectedId;
      for (let [id, sockId] of onlineUsers) {
        if (sockId === socket.id) {
          disconnectedId = id;
          onlineUsers.delete(id);
          break;
        }
      }
      if (disconnectedId) {
        io.emit("updateUserStatus", {
          userId: disconnectedId,
          status: "offline",
        });
      }
    });
  });
};

module.exports = initializeSocket;
