const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const giftSchema = new Schema(
  {
    giftAmount: {
      type: Number,
      required: true
    },
    giftLimit:{
        type:Number,
        default:0
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("GiftItem", giftSchema);
