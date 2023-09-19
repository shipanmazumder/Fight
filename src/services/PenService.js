const GiftItem = require("../models/GiftItem");
const PenList = require("../models/PenList");
const Player = require("../models/Player");
const { socketResponse } = require("../util/ResponseUtill");

module.exports = class PenService {
  async penAdd() {
    let penData = [
      {
        name: "Simple Cheap Pen",
        requiredLevel:0,
        penId: "a96bdbe8-8a3a-465a-998d-74e9bf5c163e",
        position:1
      },
      {
        name: "Skinny Grip",
        requiredLevel:2,
        penId: "a6473999-e742-4a1a-b1c8-a5112677739e",
        position:2
      },
      {
        name: "Fatty Fat",
        requiredLevel:5,
        penId: "84078b26-0e5d-4cdd-a517-4d6f90a04a5d",
        position:3
      },
      {
        name: "Plastic Gel Pen",
        requiredLevel:7,
        penId: "ccb23f14-b60a-433e-9c5f-3cce5444c94d",
        position:4
      },
      {
        name: "Cute Pen",
        requiredLevel:10,
        penId: "917c711e-f129-40c1-b570-52224e747af6",
        position:5
      },
      {
        name: "Click Pen",
        requiredLevel:15,
        penId: "e98fba4a-476e-4203-b5e6-d020d3cea33b",
        position:6
      },
      {
        name: "Fountain Pen",
        requiredLevel:20,
        penId: "6d67ec40-c4b2-4111-bc56-43024e53e4e3",
        position:7
      },
      {
        name: "Multi Color Pen",
        requiredLevel:30,
        penId: "359e497c-7544-4a6d-9f2e-b5b6dcccdd75",
        position:8
      },
      {
        name: "Crystal",
        requiredLevel:40,
        penId: "48473ca7-4208-4d9c-9d27-9a9b8c94838c",
        position:9
      },
      {
        name: "Ulka",
        requiredLevel:50,
        penId: "11705250-334b-446e-b547-8ca055dd6fdb",
        position:10
      },
    ];
    try {
      await PenList.insertMany(penData);
      return { code: 200, data: null };
    } catch (error) {
      throw new Error(err);
    }
  }
  async penList() {
    try {
      return await PenList.find();
    } catch (error) {
      throw new Error(error);
    }
  }
  async penUnlockOrPurchaseOrSelect(penId, type, user) {
    try {
      let pen = await PenList.findOne({ penId: penId });
      if (pen) {
        if (type == 2) {
          let unlocked = user.inventory.pens.unlocked;
          if (user.inventory.pens.unlocked.includes(pen.penId)) {
            let purchase = user.inventory.pens.purchase;
            if (
              !user.inventory.pens.purchase.includes(
                user.inventory.pens.selected
              )
            ) {
              purchase.push(user.inventory.pens.selected);
            }
            unlocked = user.inventory.pens.unlocked.filter((penId) => {
              return penId != pen.penId;
            });
            let locked = user.inventory.pens.locked.filter((penId) => {
              return penId != pen.penId;
            });
            let selected = pen.penId;

            let pens = {
              locked: locked,
              unlocked: unlocked,
              purchase: purchase,
              selected: selected,
            };
            user.inventory.pens = pens;
            await user.save();
            return { code: 200, data: null };
          } else {
            return { code: 407, data: null };
          }
        } else if (type == 3) {
          let locked = user.inventory.pens.locked;
          let purchase = user.inventory.pens.purchase;
          let unlocked = user.inventory.pens.unlocked;
          if (user.inventory.pens.purchase.includes(pen.penId)) {
            if (
              !user.inventory.pens.purchase.includes(
                user.inventory.pens.selected
              )
            ) {
              purchase.push(user.inventory.pens.selected);
            }
            let selected = pen.penId;

            let pens = {
              locked: locked,
              unlocked: unlocked,
              purchase: purchase,
              selected: selected,
            };
            user.inventory.pens = pens;
            await user.save();
            console.log("seleced")
            return { code: 200, data: null };
          } else {
            return { code: 408, data: null };
          }
        } else if (type == 1) {
          let purchase = user.inventory.pens.purchase;
          let unlocked = user.inventory.pens.unlocked;
          if (user.inventory.pens.locked.includes(pen.penId)) {
            let locked = user.inventory.pens.locked.filter((penId) => {
              return penId != pen.penId;
            });
            if (!user.inventory.pens.unlocked.includes(pen.penId)) {
                unlocked.push(pen.penId);
            }
            let selected = user.inventory.pens.selected;

            let pens = {
              locked: locked,
              unlocked: unlocked,
              purchase: purchase,
              selected: selected,
            };
            user.inventory.pens = pens;
            await user.save();
            return { code: 200, data: null };
          } else {
            return { code: 410, data: null };
          }
        }
      } else {
        return { code: 409, data: null };
      }
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  }
};
