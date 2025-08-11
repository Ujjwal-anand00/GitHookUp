const { userAuth } = require("../Middleware/Auth");
const Chat = require("../models/chat");
const express = require("express");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      model: "User",
      select: "firstName lastName photoUrl",
    }).populate({
      path: "participants",
      model: "User",
      select: "firstName lastName photoUrl",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = chatRouter;
