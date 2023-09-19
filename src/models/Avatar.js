const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const avatarSchema = new Schema(
  {
    name: {
      type: String,
    },
    avatarUniqueId: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String
    },
    type:{
      type:String,
      default:"local"
    },
    position:{
        type:Number
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Avatar", avatarSchema);
