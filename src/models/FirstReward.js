const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rewardSchema = new Schema(
  {
    guestCoinAmount: {
      type: Number,
      required: true
    },
    facebookCoinAmount: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("FirstReward", rewardSchema);
