const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../Middleware/Auth");
const ConnectionRequest = require("../models/connectionRequest");
const { connect } = require("mongoose");

const USER_SAFE_DATA = "firstName lastName photoUrl age skills about gender";

// get all the pending connection request from the logged in user
userRouter.get("/user/request/received" ,userAuth , async(req,res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        if(!connectionRequest || connectionRequest.length === 0){
            return res.status(404).json({
                message: "No connection requests found",
            });
        }
        res.json({
            message: "All the connection requests",
            data: connectionRequest,
        });


    }catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
});

userRouter.get("/user/connections" , userAuth , async(req,res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA); 

        const data = connectionRequests.map((row) =>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return  row.toUserId;
            }

            return row.fromUserId;
        });
        res.json({
            message: "All the connections of " + loggedInUser.firstName,
            data: data,
        });

    }catch(err){
        res.status(400).send("ERROR :" + err.message);
    }

});



module.exports = userRouter;
