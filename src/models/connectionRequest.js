const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["accepted", "rejected", "interested", "ignored"],
        message: "{VALUE} is not a valid status",
      },
      default: "ignore",
    },
  },
  {
    timestamps: true,
  }
);
connectionRequestSchema.index(
  { fromUserId: 1, toUserId: 1 },
  { unique: true }
);
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // check if the toUserId and fromUserId are the same
    if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
      throw new Error("Cannot send a connection request to yourself");
    }
    next();
});
const connectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = connectionRequestModel;
