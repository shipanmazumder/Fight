const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const geoipLite = require("geoip-lite");

const { customAlphabet } = require("nanoid");
const Player = require("../models/Player");
const FirstReward = require("../models/FirstReward");
const PenList = require("../models/PenList");
const Facker = require("../util/Facker");
const Reward = require("../models/Reward");
const Avatar = require("../models/Avatar");
const Match = require("../models/Match");

const alphabet = "0123456789";
const nanoid = customAlphabet(alphabet, 12);
module.exports = class PlayerService {
  async playerAuthentic(body, clientIp) {
    let loginId = "";
    let name = body.name;
    let fbId = body.fbId;
    let duId = body.duId;
    try {
      if (!fbId) {
        let player = await Player.findOne({ loginId: duId });
        if (player) {
          name = player.name;
          loginId = player.loginId;
        } else {
          let tempName = `Guest_${nanoid()}`;
          while (await Player.findOne({ name: tempName })) {
            tempName = `Guest_${nanoid()}`;
          }
          name = tempName;
          loginId = duId;
        }
        return this.playerUpdateOrCreate(name, fbId, duId, loginId, body,clientIp);
      } else {
        let player = await Player.findOne({ loginId: fbId });
        if (player) {
          //if previous login with facebook
          loginId = fbId;
          return this.playerUpdateOrCreate(
            name,
            fbId,
            duId,
            loginId,
            body,
            clientIp
          );
        } else {
          let player = await Player.findOne({ loginId: duId });
          if (player) {
            //if previous login with device id but now convert with fb id
            loginId = duId;
          } else {
            //new login with facebook
            loginId = fbId;
          }
          return this.playerUpdateOrCreate(
            name,
            fbId,
            duId,
            loginId,
            body,
            clientIp
          );
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  /**
   * player update or create
   * @param {*} name
   * @param {*} fbId
   * @param {*} duId
   * @param {*} loginId
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async playerUpdateOrCreate(name, fbId, duId, loginId, body, clientIp) {
    var firstTimeFBLogin=false;
    let firebaseToken = body.firebaseToken;
    let pictureUrl="";
    if(!fbId){
      pictureUrl="https://ulka-profile-pics.s3.ap-south-1.amazonaws.com/DefaultProfilePicture.png"
    }else{
      pictureUrl = body.pictureUrl;
    }
    let email = body.email;
    let phone = body.phone;
    let fbAccessToken = body.fbAccessToken;
    let friends = body.friends;
    let ip = clientIp;
    if (process.env.APP_ENV == "development") {
      ip = "103.4.145.2";
    }
    let friendsMap = [];
    if (friends.length > 0) {
      for (var i = 0; i < friends.length; i++) {
        let fbFriend = await Player.findOne({ fbId: friends[i] });
        if (fbFriend) {
          friendsMap.push({
            friendId: fbFriend._id,
            type: "FB",
            friendStatus: true,
          });
        }
      }
    }
    try {
      let player = await Player.findOne({ loginId: loginId });
      const firstReward = await FirstReward.findOne().sort("_id");
      if (player) {

        if (fbId) {
          loginId = fbId;
        }
        const oldGameFirends = player.friends.filter(
          (friend) => friend.type === "GAME"
        );
        friendsMap = [...friendsMap, ...oldGameFirends];

        if (player.duId !== duId) {
          const result =  player.deviceLog.find( (p) => p.duId ==duId );
          let deviceLogs = player.deviceLog;
          if(typeof result=="undefined"){
            deviceLogs.push({duId:duId})  
          }
          player.deviceLog=deviceLogs;
        }
        if(fbId!='' && player.fbId==''){
          firstTimeFBLogin=true;
          player.currentCoin+=firstReward.facebookCoinAmount
        }
        let matchCount=await Match.countDocuments({userId:player.userId}); //count player total match played
        player.name = name;
        player.email = phone;
        player.phone = phone;
        player.fbId = fbId;
        player.fbAccessToken = fbAccessToken;
        player.firebaseToken = firebaseToken;
        player.pictureUrl = pictureUrl;
        player.totalPlayedMatch=matchCount; //player totalplayed match update 
        player.friends = friendsMap;
        player.loginId = loginId;
        player.duId = duId;
        if(player.avatarSelected!=''){
          player.avatarSelected=pictureUrl;
        }
        let avatarList=await Avatar.find().sort({ "position": 1 });
        if(avatarList){
          avatarList=avatarList.map((avatar)=>{
            return avatar.avatarUniqueId
          })
        }
        if(player.inventory.avatars.selected==undefined){
          let avatars={
            selected:"0",
            unlocked:avatarList,
            purchase:[],
            locked:[]
          }
          // console.log(avatars); 
          let oldInventory=player.inventory;
          oldInventory.avatars=avatars;
          player.inventory=oldInventory;
        }
        let savePlayer = await player.save();
        var token = this.generateJwtToken(savePlayer);
        return {
          code: 202,
          data: {
            player: savePlayer,
            guestCoinAmount:firstReward.guestCoinAmount,
            facebookCoinAmount:firstReward.facebookCoinAmount,
            firstTimeFBLogin: firstTimeFBLogin,
            token: token,
          },
        };
      } else {
        let penList=await PenList.find().sort({ "position": 1 }).select("penId");
        if(penList){
          penList=penList.map((pen)=>{
            return pen.penId
          })
        }
        var geoLocation = await geoipLite.lookup(ip);
        // const location = {
        //   country: geoLocation.country,
        //   timezone: geoLocation.timezone,
        //   city: geoLocation.city,
        //   ll: geoLocation.ll,
        // };
        const location = {
          country: "BD",
          timezone: "Asia/Dhaka",
          city: "Dhaka",
          ll: ["-3","3"],
        };
        let tempUserId = `${nanoid()}`;
        while (await Player.findOne({ userId: tempUserId })) {
          tempUserId = `${nanoid()}`;
        }

      let rewardList=await Reward.find().sort({ "position": 1 });
      let avatarList=await Avatar.find().sort({ "position": 1 });
      if(avatarList){
        avatarList=avatarList.map((avatar)=>{
          return avatar.avatarUniqueId
        })
      }
      // console.log(rewardList);
      let rewardReceivedList=[];
      rewardList.forEach(reward=>{
        rewardReceivedList.push({
          rewardType:reward.rewardType,
          rewardCount:1,
          lastRewardTime:Date.now()
        });
      })
      // console.log(rewardReceivedList)
      if(fbId!=""){
        firstTimeFBLogin=true;
      }
        player = new Player({
          name: name,
          email: email,
          phone: phone,
          fbId: fbId,
          fbAccessToken: fbAccessToken,
          duId: duId,
          loginId: loginId,
          userId: tempUserId,
          firebaseToken: firebaseToken,
          pictureUrl: pictureUrl,
          currentCoin: fbId==""?firstReward.guestCoinAmount:firstReward.facebookCoinAmount,
          friends: friendsMap,
          location: location,
          challenges: [],
          currentXP: 0,
          currentLevelXP: 0,
          deviceLog: [{
            duId:duId
          }],
          totalWinCoin: 0,
          weeklyWinCoin: 0,
          level: 0,
          avatarSelected:pictureUrl,
          rewardReceived:rewardReceivedList,
          inventory:{
            pens:{
              selected:penList.length>0?penList[0]:"",
              unlocked:[],
              purchase:[],
              locked:penList.slice(1)
            },
            avatars:{
              selected:"0",
              unlocked:avatarList,
              purchase:[],
              locked:[]
            }
          }
        });
        let savePlayer = await player.save();
        var token = this.generateJwtToken(savePlayer);
        return {
          code: 201,
          data: {
            player: savePlayer,
            guestCoinAmount:firstReward.guestCoinAmount,
            facebookCoinAmount:firstReward.facebookCoinAmount,
            firstTimeFBLogin:firstTimeFBLogin,
            token: token,
          },
        };
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  static playerResponse = async (id) => {
    try {
      var player = await Player.findOne({ _id: id })
        .populate("friends.friendId")
        .exec()
        .then(async (docs) => {
          return docs;
        });
      if (!player) {
        return { code: 403, data: null };
      }
      let friends = [];
      if (player.friends) {
        friends = player.friends.map((friend) => {
          return {
            onlineStatus: friend.onlineStatus,
            type: friend.type,
            friendStatus: friend.friendStatus,
            name: friend.friendId.name,
            fbId: friend.friendId.fbId,
            userId: friend.friendId.userId,
            level: friend.friendId.level,
          };
        });
      }
      let rewardList=await Reward.find();
      let rewardAvailableList=[];
      let nowTime=Math.floor((new Date().getTime())/1000);
      var isRewardAvailable=true;
      rewardList.forEach(reward => {
        isRewardAvailable=true; 
        if(reward.rewardType=="Reward Ads"){
          isRewardAvailable=true;
        }else{
          let getIndex = player.rewardReceived.findIndex((type) => {
            return JSON.stringify(type.rewardType) === JSON.stringify(reward.rewardType) 
          });
          if(getIndex!=-1){
            if(reward.rewardType=="Free Coin"){
              let oldReward=player.rewardReceived[getIndex];
                if(Math.floor((oldReward.lastRewardTime.getTime()+1000*60*60*24)/1000)>=Math.floor((new Date().getTime())/1000)){
                  isRewardAvailable=false;
                  let data={
                    rewardType:reward.rewardType,
                    rewardAmount:reward.rewardAmount,
                    rewardAvailable:false,
                    lastRewardTime:oldReward.lastRewardTime,
                    nextAvaiableTime:Math.floor((oldReward.lastRewardTime.getTime()+1000*60*60*24)/1000),
                    nowTime:nowTime
                  }
                  rewardAvailableList.push(data);
                }
            }
          }
        }
        if(isRewardAvailable){
          let data={
            rewardType:reward.rewardType,
            rewardAmount:reward.rewardAmount,
            rewardAvailable:true,
            nextAvaiableTime:nowTime,
            nowTime:nowTime
          }
          rewardAvailableList.push(data);
        }
      });
      let worldRank= await PlayerService.getWorldRank(player)
      // let worldRank=0;

      let selectedAvatarUrl=player.pictureUrl;

      if(player.inventory.avatars.selected!="0"){
        let avater=await Avatar.findOne({avatarUniqueId:player.inventory.avatars.selected});
        if(avater){
          selectedAvatarUrl=avater.avatarUrl;
        } 
      }
      // console.log(worldRank)
      let data = {
        hasPlayedAnyGame:player.hasPlayedAnyGame,
        country: player.location.country,
        city: player.location.city,
        name: player.name,
        fbId: player.fbId,
        userId: player.userId,
        currentWinStreak: player.currentWinStreak,
        bestWinStreak: player.bestWinStreak,
        worldRank: worldRank,
        pictureUrl: player.pictureUrl,
        currentCoin: player.currentCoin,
        totalWinCoin: player.totalWinCoin,
        friends: friends,
        currentXP: player.currentXP,
        targetXP:(player.level<12?Facker.targetXp[player.level]:(player.currentLevelXP>=600?600:player.currentLevelXP+50)),
        level: player.level,
        totalWinMatch: player.totalWinMatch,
        totalPlayedMatch: player.totalPlayedMatch,
        avatarSelected: selectedAvatarUrl,
        frameSelected: 2,
        bannerSelected: 2,
        penSelected: player.inventory.pens.selected,
        inventory:player.inventory,
        rewardAvailableList:rewardAvailableList,
        // inventory: {
        //   avatars: {
        //     unlocked: [],
        //     locked: [],
        //   },
        //   frames: {
        //     unlocked: [],
        //     locked: [],
        //   },
        //   banners: {
        //     unlocked: [],
        //     locked: [],
        //   },
        // },
      };
      return { code: 200, data: data };
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  };
  /**
   * generate jwt token for login auth
   * @param {*} player
   * @return jwt token
   */
  generateJwtToken = (player) => {
    var privateKey = fs.readFileSync("./jwtRS256.key");
    var token = jsonwebtoken.sign(
      {
        data: {
          name: player.name,
          userId: player.userId,
          id: player._id,
          fbId: player.fbId,
          loginId: player.loginId,
        },
      },
      privateKey,
      {
        // algorithm: "RS256",
        expiresIn: "720h",
      }
    );
    return `Bearer ${token}`;
  };

  async otherPlayerInfo(id) {
    try {
      return await Player.findOne({ userId: id });
    } catch (error) {
      throw new Error(error);
    }
  }

  async searchFriends(name,id) {
    try {
      return await Player.find({
        name: { $regex: name, $options: "i" },
        _id: { $ne: id},
        fbid: { $ne: "" },
      })
        .limit(5)
        .exec()
        .then((friends) => friends);
    } catch (error) {
      throw new Error(error);
    }
  }
  async checkFBLogin(duId){
    try {
      let player= await Player.findOne({"deviceLog.duId":duId,fbId:{ $ne: "" }});
      if(player){
        return {code:200,data:player}
      }else{
        return {code:413,data:null}
      }
      
    } catch (error) {
      throw new Error(error);
    }
  }
 static async getWorldRank(gamePlayer){
    let players = await Player.find({},'_id')
    .sort({ "totalWinCoin": -1 })
    .limit(20);
   const globalPlayerIndex = players.findIndex((player) => {
        return JSON.stringify(player._id) === JSON.stringify(gamePlayer._id);
      });
      // console.log(globalPlayerIndex);
      let myPosition=0;
      if(globalPlayerIndex==-1){
        myPosition = await Player.find({totalWinCoin:{$gt:gamePlayer.totalWinCoin}},'_id')
        .countDocuments();
        myPosition=myPosition+1;
      }else{
        myPosition=globalPlayerIndex+1;
      }
      return myPosition;
    }
};
