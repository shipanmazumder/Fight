const GiftItem = require("../models/GiftItem");
const Player = require("../models/Player");
const Reward = require("../models/Reward");
const { socketResponse } = require("../util/ResponseUtill");

module.exports = class RewardService {
  async rewardAdd() {
    try {
      let data = [
        {
          rewardType: "Free Coin",
          rewardAmount: 100,
          position:1
        },
        {
          rewardType: "Reward Ads",
          rewardAmount: 1000,
          position:2,
        },
      ];
      return await Reward.insertMany(data);
    } catch (error) {
      throw new Error(error);
    }
  }
  async rewardList() {
    try {
      return await Reward.find();
    } catch (error) {
      throw new Error(error);
    }
  }
  async verifyRewardAds(body, user) {
    try {
      let type = body.type;
      let reward = await Reward.findOne({ rewardType: type });
      if (reward) {
        user.currentCoin = user.currentCoin + reward.rewardAmount;
        let getIndex = user.rewardReceived.findIndex((type) => {
          return JSON.stringify(type.rewardType) === JSON.stringify(reward.rewardType) 
        });
        let lastRewardTime=new Date();
        let nextAvaiableTime=Math.floor((lastRewardTime.getTime()+1000*60*60*24)/1000); //in seconds
        if(getIndex!=-1){
          if(reward.rewardType=="Free Coin"){
            let oldReward=user.rewardReceived[getIndex];
            if(Math.floor((oldReward.lastRewardTime.getTime()+1000*60*60*24)/1000)<=Math.floor((new Date().getTime())/1000)){
              user.rewardReceived[getIndex].rewardType=reward.rewardType;
              user.rewardReceived[getIndex].rewardCount+=1;
              user.rewardReceived[getIndex].lastRewardTime=lastRewardTime;
            }else{
              return { code: 412, data: null };
            }
          }else{
            user.rewardReceived[getIndex].rewardType=reward.rewardType;
            user.rewardReceived[getIndex].rewardCount+=1;
            user.rewardReceived[getIndex].lastRewardTime=lastRewardTime;
          }
        }else{
          let userUpdatedList=[...user.rewardReceived];
          userUpdatedList.push({
            rewardType:reward.rewardType,
            rewardCount:1,
            lastRewardTime:lastRewardTime
          });
          user.rewardReceived=userUpdatedList;
        }
        await user.save();
        let data = {
          rewardType:reward.rewardType,
          rewardAmount:reward.rewardAmount,
          rewardAvailable:false,
          lastRewardTime:lastRewardTime,
          nextAvaiableTime:nextAvaiableTime,
          nowTime:Math.floor(lastRewardTime.getTime()/1000),
          rewardAmount: reward.rewardAmount,
        };
        return { code: 200, data: data };
      } else {
        return { code: 411, data: null };
      }
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  }
};
