const AvatarService = require('../services/AvatarService');
const { successResponse } = require('../util/ResponseUtill');

const avatarService=new AvatarService();

exports.avatarAdd = async (req, res, next) => {
    try {
      let pen = await avatarService.avatarAdd();
      if (pen.code === 200) {
        return res
          .status(200)
          .json(successResponse(true, 200, "Avater Add Success", null));
      }else {
        throw new Error();
      }
    } catch (error) {
      console.log(error)
      next({
        status: 500,
      });
    }
  };

exports.avatarList = async (req, res, next) => {
    try {
      let avatar = await avatarService.avatarList(req.user);
      var data = {
        avatar: avatar
      };
  
      res.status(200).json(successResponse(true, 200, "Avatar List", data));
    } catch (error) {
      next({
        status: 500,
      });
    }
  };
exports.avatarSelect = async (req, res, next) => {
    try {
        let avatarId = req.body.avatarId;
      let avatar = await avatarService.avatarSelect(avatarId,req.user);
      console.log(avatar)
      if (avatar.code === 200) {
        return res
          .status(200)
          .json(successResponse(true, 200, "Success", null));
      } else if (avatar.code === 414) {
        return res
          .status(200)
          .json(successResponse(false, 407, "Avatar Not found", null));
      }else {
        throw new Error();
      }
    } catch (error) {
        console.log(error)
      next({
        status: 500,
      });
    }
  };