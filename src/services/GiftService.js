const GiftItem = require("../models/GiftItem");
const Player = require("../models/Player");
const { socketResponse } = require("../util/ResponseUtill");

module.exports=class GiftService{
   async sendGift(body,user){
        let friends=body.friends;
        if(friends.length>0){
            var giftItem=await GiftItem.findOne().sort("_id");
            friends.forEach(async (userId) => {
                let player=await Player.findOne({userId:userId});
                if(player){
                    let giftData={
                        playerId:player._id,
                        amount:giftItem.giftAmount,
                        giftType:"Received"
                    }
                    player.gifts.unshift(giftData);
                    await player.save();
                    socketResponse([player.userId],"Received Gift",`${player.name} sent you gift`);
                }
            });
            user.sendGiftCount=user.sendGiftCount+friends.length;
           await user.save();
           return {code:200,data:null}
        }else{
           return {code:404,data:null}
        }
    }
   async requestGift(body,user){
        let friends=body.friends;
        if(friends.length>0){
            var giftItem=await GiftItem.findOne().sort("_id");
            friends.forEach(async (userId) => {
                let player=await Player.findOne({userId:userId});
                if(player){
                    let giftData={
                        playerId:player._id,
                        amount:giftItem.giftAmount,
                        giftType:"Request"
                    }
                    player.gifts.unshift(giftData);
                    await player.save();
                    socketResponse([player.userId],"Request Gift",`${player.name} request you gift`);
                }
            });
            user.requestGiftCount=user.requestGiftCount+friends.length;
           await user.save();
           return {code:200,data:null}
        }else{
           return {code:404,data:null}
        }
    }
}