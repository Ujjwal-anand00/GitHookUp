const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middleware/Auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserID",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserID;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status :" + status,
        });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).send({
          message: "Connection request already exists",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR " + err.message);
    }
  }
);

requestRouter.post("/request/review/:status/:requestID" , userAuth , async(req,res)=>{
    try{
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      const {status , requestID} = req.params;
      if(!allowedStatus.includes(status)){
        return res.status(400).json({
            message : "Invalid status :" + req.params.status,
        });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestID,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: loggedInUser.firstName + " has " + status + " the request",
        data,
      });

    }catch(err){
        res.status(400).send("ERROR " + err.message);
    }
});
module.exports = requestRouter;
