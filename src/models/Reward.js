const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rewardSchema = new Schema(
  {
    rewardType: {
      type: String,
      required: true
    },
    rewardAmount: {
      type: Number,
      required: true
    },
    position:{
      type:Number
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Reward", rewardSchema);
