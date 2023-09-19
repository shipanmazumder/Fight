const mongoose = require("mongoose");
const Game = require("./Game");

const Schema = mongoose.Schema;
const Player = new Schema({
  name: {
    type: String,
  },
  location: {
    country: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  pictureUrl: {
    type: String,
  },
  avatarSelected: {
    type: String,
  },
  totalPlayedMatch: {
    type: Number,
    default: 0,
  },
  totalWinMatch: {
    type: Number,
    default: 0,
  },
  currentXP: {
    type: Number,
  },
  level: {
    type: Number,
    default: 0,
  },
  totalWinCoin: {
    type: Number,
    default: 0,
  },
  currentLevelXP: {
    type: Number,
    default: 0,
  },
  targetXP: {
    type: Number,
    default: 0,
  },
  currentWinStreak:{
    type:Number,
    default:0
  },
  bestWinStreak:{
    type:Number,
    default:0
  },
});
const matchSchema = new Schema(
  {
    matchUniqueId: {
      type: String,
      required: true,
    },
    userId:{
      type:Number,
      index:true
    },
    totalPlayers: {
      type: Number,
    },
    winXP: {
      type: Number,
    },
    loseXP: {
      type: Number,
    },
    roundXP: {
      type: Number,
    },
    gameModeName:{
      type:String
    },
    gameMatchCoin: {
      type: Number,
    },
    players:[Player]
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Match", matchSchema);
