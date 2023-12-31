const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const gameMode=new Schema(
  {
    modeName:{
      type:String
    },
    modeAmount:{
      type:Number
    },
    winAmount:{
      type:Number
    },
    winXP:{
        type:Number
    },
    loseXP:{
        type:Number
    }
  }
);
const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gameUniqueId:{
        type:String,
        required:true
    },
    winXP:{
        type:Number
    },
    loseXP:{
        type:Number
    },
    gameMode:[gameMode]
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Game", gameSchema);
