const express = require( 'express' );
const { gameStart, gameOver, gameAdd, getGame } = require('../../controllers/GameController');
const { sendGift, requestGift } = require('../../controllers/GiftController');
const { globalLeaderBoard } = require('../../controllers/LeaderBoardController');
const { penAdd, penUnlockOrPurchaseOrSelect, penList } = require('../../controllers/PenController');
const {playerAuthentic, playerInfo, otherPlayerInfo, searchFriends, checkFBLogin} = require("../../controllers/PlayerController");
const { rewardAdd, verifyRewardAds, rewardList } = require('../../controllers/RewardController');
const { isAuth } = require('../../middlewares/AuthCheck');
const FirstReward = require('../../models/FirstReward');
const GiftItem = require('../../models/GiftItem');
const Player = require('../../models/Player');
const { playerValidate, gameOverValidate, gameStartValidate } = require('../../util/ValidationUtill');
const {avatarAdd, avatarList, avatarSelect} = require('../../controllers/AvatarController');


let route = express.Router();

route.all( '/', ( req, res ) => {
  res.send( { message : 'Hello from Express!' } );
} );
route.post("/player-authentic",playerValidate,playerAuthentic)
route.get("/player-info",isAuth,playerInfo)
route.get("/other-player-info",isAuth,otherPlayerInfo)
route.get("/search-friends",isAuth,searchFriends)
route.get("/get-game",isAuth,getGame)
route.post("/game-start",gameStartValidate ,isAuth,gameStart)
route.post("/game-over",gameOverValidate,isAuth,gameOver)
route.post("/game-add",isAuth,gameAdd)
route.get("/leaderboard",isAuth,globalLeaderBoard)
route.post("/send-gift",isAuth,sendGift)
route.post("/request-gift",isAuth,requestGift)

route.post("/pen-selected",isAuth,penUnlockOrPurchaseOrSelect)
route.get("/pen-list",isAuth,penList)
route.post("/pen-add",isAuth,penAdd)

route.post("/avatar-add",isAuth,avatarAdd)
route.post("/reward-add",isAuth,rewardAdd)
route.post("/verify-reward-ads",isAuth,verifyRewardAds)
route.get("/reward-list",isAuth,rewardList)
route.get("/fb-login-check",isAuth,checkFBLogin)

route.get("/avatar-list",isAuth,avatarList)
route.post("/avatar-selected",isAuth,avatarSelect)

// route.post("/pen-add",isAuth,penAdd)
if (process.env.APP_ENV == "development") {
  route.get("/delete-player",async(req,res,next)=>{
    let id = req.query.userId;
    Player.deleteOne({userId:id}).then((result)=>{
      res.send(result)
    });
  })
}
route.get("/firebase-test",async (req,res,next)=>{
  let ids=req.query.id.split(',');
  console.log(ids);
  PushNotification.sendPushNotification(ids,"Test","Test Body","nothing");
  res.send("dd");
})
route.get("/players-test",async (req,res,next)=>{
  let players=await Player.find({fbId:""}).select("firebaseToken");
  res.send(players);
})
route.get("/test",async (req,res,next)=>{
  let first=new FirstReward({
      guestCoinAmount:2000,
      facebookCoinAmount:10000
  })
    first.save()
        .then((result)=>{
            // res.send("seccues")
            let gift=new GiftItem({
              giftAmount:100,
              giftLimit:20
            });
            gift.save()
            .then((result)=>{
              res.send(result)
            })
        })
})

module.exports = route;