const mongoose = require("mongoose");

const connectionSchema = mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["ignored", "interested", "rejected", "accepted"],
      message: `{value} is not valid status!`,
    },
  },
});

connectionSchema.pre("save", function (next) {
  const connectionReq = this;

  if (connectionReq.fromUserId.equals(connectionReq.toUserId)) {
    throw new Error("You can't sent request to your self!");
  }
  next();
});

const ConnectionRequestModel = mongoose.model("connections", connectionSchema);

module.exports = { ConnectionRequestModel };
