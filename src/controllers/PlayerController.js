const ResponseUtill = require("../util/ResponseUtill");
const { validationResult } = require("express-validator");
const PlayerService = require("../services/PlayerService");
const {
  validationResponse,
  successResponse,
  errorResponse,
  socketResponse,
} = require("../util/ResponseUtill");

var playerService = new PlayerService();
exports.playerAuthentic = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validationResponse(errors));
    }
    // We only pass the body object, never the req object
    let result = await playerService.playerAuthentic(req.body, req.clientIp);
    if (result) {
      if (result.code === 201 || result.code === 202) {
        let player = await PlayerService.playerResponse(result.data.player._id);
        if (player.code == 403) {
          return res
            .status(200)
            .json(successResponse(false, 403, "Player Not Found", null));
        }
        let isNewPlayer = false;
        let message = "Player Update Successfully";
        if (result.code === 201) {
          isNewPlayer = true;
          message = "Player Add Successfully";
        }
        var data = {
          isNewPlayer: isNewPlayer,
          firstTimeFBLogin: result.data.firstTimeFBLogin,
          guestCoinAmount: result.data.guestCoinAmount,
          facebookCoinAmount: result.data.facebookCoinAmount,
          token: result.data.token,
          player: player.data,
        };
        var socketMessage = {
          player: result.data.player,
        };
        if(result.code===202){
          socketResponse(
            [result.data.player.userId],
            "NewDevice",
            "New Device Login",
            socketMessage
          );
        }
        return res
          .status(200)
          .json(successResponse(true, result.code, message, data));
      } else {
        next({
          status: 500,
        });
      }
    } else {
      next({
        status: 500,
      });
    }
  } catch (err) {
    console.log(err);
    next({
      status: 500,
    });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.playerInfo = async (req, res, next) => {
  try {
    let player = req.user;
    let playerDetails = await PlayerService.playerResponse(player._id);
    var data = {
      player: playerDetails.data,
    };
     res.status(200).json(successResponse(true, 200, "Player Info", data));
    
  } catch (error) {
    next({
      status: 500,
    });  
  }
};
/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.otherPlayerInfo = async (req, res, next) => {
  try {
    let id = req.query.userId;
    let player =await playerService.otherPlayerInfo(id);
    if (!player) {
      return res
        .status(200)
        .json(successResponse(false, 403, "Player Not Found", null));
    }
    let playerDetails = await PlayerService.playerResponse(player._id);
    playerDetails.data.inventory = null;
    var data = {
      player: playerDetails.data,
    };
     res.status(200).json(successResponse(true, 200, "Other Player Info", data));
    
  } catch (error) {
    next({
      status: 500,
    });
  }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.searchFriends =async (req, res, next) => {
  let name = req.query.name;
  let id=req.user._id;
  try {
    let friends=await playerService.searchFriends(name,id);
    if (friends.length <= 0) {
      return res.status(200).json(successResponse(false,404,"No friends Found",null))
    }
  
    var data = {
      friends: friends,
    };
    res.status(200).json(successResponse(true,200,"Friend List",data))
    
  } catch (error) {
    next({
      status: 500,
    });
  }
  
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.checkFBLogin =async (req, res, next) => {
  let duid=req.user.duId;
  // let duid="3764638784568744";
  try {
    let result=await playerService.checkFBLogin(duid);
    if(result.code==200){
      let data={
        hasLoggedInFacebook:true
      }
    res.status(200).json(successResponse(true,200,"Facebook Login Check",data))
    }else if(result.code==413){
      let data={
        hasLoggedInFacebook:false
      }
      res.status(200).json(successResponse(true,200,"No Facebook Login Previous",data))
      
    }
    
  } catch (error) {
    next({
      status: 500,
    });
  }
  
};
