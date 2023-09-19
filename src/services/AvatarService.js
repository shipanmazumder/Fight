// const {nanoid} = require('nanoid');
const { v4: uuidv4 } = require("uuid");

const Avatar = require("../models/Avatar");

module.exports = class AvatarService {
  async avatarAdd() {
    let avatarData = [
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/1.jpg",
        avatarUniqueId: uuidv4(),
        position: 2,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/2.jpg",
        avatarUniqueId: uuidv4(),
        position: 3,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/3.jpg",
        avatarUniqueId: uuidv4(),
        position: 4,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/4.jpg",
        avatarUniqueId: uuidv4(),
        position: 5,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/5.jpg",
        avatarUniqueId: uuidv4(),
        position: 6,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/6.jpg",
        avatarUniqueId: uuidv4(),
        position: 7,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/7.jpg",
        avatarUniqueId: uuidv4(),
        position: 8,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/8.jpg",
        avatarUniqueId: uuidv4(),
        position: 9,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/9.jpg",
        avatarUniqueId: uuidv4(),
        position: 10,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/10.jpg",
        avatarUniqueId: uuidv4(),
        position: 11,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/11.jpg",
        avatarUniqueId: uuidv4(),
        position: 12,
      },
      {
        name: "",
        avatarUrl: "https://ulka-penfight.s3.ap-south-1.amazonaws.com/12.jpg",
        avatarUniqueId: uuidv4(),
        position: 13,
      },
    ];
    try {
      await Avatar.insertMany(avatarData);
      return { code: 200, data: null };
    } catch (error) {
      throw new Error(error);
    }
  }
  async avatarList(user) {
    try {
      let avatars= await Avatar.find().sort({ "position": 1 });
      let avatar={
        name:"",
        avatarUniqueId:"0",
        avatarUrl:user.pictureUrl,
        type:"server"
      }
      avatars.unshift(avatar);
      return avatars;
    } catch (error) {
      throw new Error(error);
    }
  }
  async avatarSelect(avatarId, user) {
    try {
      if (avatarId != "0") {
        let avatar = await Avatar.findOne({ avatarUniqueId: avatarId });
        user.avatarSelected=avatar.avatarUrl;
        // console.log(user.avatarSelected)
        if(!avatar){
        return { code: 414, data: null };
        }
      }
      let locked = user.inventory.avatars.locked;
      let purchase = user.inventory.avatars.purchase;
      let unlocked = user.inventory.avatars.unlocked;
      if (user.inventory.avatars.unlocked.includes(avatarId)) {
        if (
          !user.inventory.avatars.unlocked.includes(
            user.inventory.avatars.selected
          )
        ) {
          unlocked.push(user.inventory.avatars.selected);
        }
        let selected = avatarId;

        let avatars = {
          locked: locked,
          unlocked: unlocked,
          purchase: purchase,
          selected: selected,
        };
        if(avatarId=="0"){
          user.avatarSelected=user.pictureUrl;
        }
        // console.log(user.avatarSelected)
        user.inventory.avatars = avatars;
        await user.save();
        // console.log("seleced");
        return { code: 200, data: null };
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
};
