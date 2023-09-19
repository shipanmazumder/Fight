const mongoose = require("mongoose");
const Game = require("./Game");

const Schema = mongoose.Schema;

const Friends = new Schema({
  friendId: {
    type: Schema.Types.ObjectId,
    ref: "Player",
  },
  type: {
    type: String,
  },
  friendStatus: {
    type: Boolean,
  },
});
const rewardReceivedList=new Schema({
  rewardType:{
    type:String
  },
  rewardCount:{
    type:Number
  },
  lastRewardTime:{ 
    type: Date, 
    default: Date.now 
  }
});
const deviceLogSchema=new Schema({
  duId:{
    type:String
  }
});
const playHistory = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: Game,
    },
    position: {
      type: Number,
    },
    totalPlayer: {
      type: Number,
    },
    gameMode: {
      type: String,
    },
    totalRound: {
      type: Number,
    },
    winStatus: {
      type: Boolean,
    },
    coin: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    loginId: {
      type: String,
      required: true,
      index: true,
    },
    fbId: {
      type: String,
    },
    duId: {
      type: String,
    },
    firebaseToken: {
      type: String,
    },
    fbAccessToken: {
      type: String,
    },
    hasPlayedAnyGame:{
      type:Boolean,
      default:false
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
    friends: [Friends],
    rewardReceived: [rewardReceivedList],
    currentXP: {
      type: Number,
    },
    level: {
      type: Number,
      default: 0,
    },
    currentCoin: {
      type: Number,
      default: 0,
    },
    currentLevelXP: {
      type: Number,
      default: 0,
    },
    totalWinCoin: {
      type: Number,
      default: 0,
      index:true
    },
    currentWinStreak:{
      type:Number,
      default:0
    },
    bestWinStreak:{
      type:Number,
      default:0
    },
    weeklyWinCoin: {
      type: Number,
      default: 0,
    },
    playHistory: [playHistory],
    location: {
      country: {
        type: String,
      },
      timezone: {
        type: String,
      },
      city: {
        type: String,
      },
      ll: {
        type: Array,
      },
    },
    challenges: [
      {
        friendId: {
          type: String,
          ref: "Player",
        },
      },
    ],
    gifts: [
      {
        playerId: {
          type: Schema.Types.ObjectId,
          ref: "Player",
        },
        amount: {
          type: Number,
          default: 0,
        },
        giftType: {
          type: String,
        },
      },
    ],
    sendGiftCount: {
      type: Number,
      default: 0,
    },
    requestGiftCount: {
      type: Number,
      default: 0,
    },
    deviceLog:[deviceLogSchema],
    inventory: {
      pens: {
        selected: {
          type: String,
        },
        locked: {
          type: Array,
        },
        unlocked: {
          type: Array,
        },
        purchase:{
          type:Array
        }
      },
      avatars: {
        selected: {
          type: String,
        },
        locked: {
          type: Array,
        },
        unlocked: {
          type: Array,
        },
        purchase:{
          type:Array
        }
      },
    },
  },
  {
    timestamps: true,
  }
);
playerSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.firebase_token;
  return obj;
};
module.exports = mongoose.model("Player", playerSchema);
