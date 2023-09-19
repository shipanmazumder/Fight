const { validationResult } = require("express-validator");
const GameService = require("../services/GameService");
const {
  successResponse,
  validationResponse,
} = require("../util/ResponseUtill");
const gameService = new GameService();

exports.gameAdd = async (req, res, next) => {
  try {
    let games = await gameService.gameAdd();
    res.status(200).json(successResponse(true, 201, "Games Add", games));
  } catch (error) {
    next({
      status: 500,
    });
  }
};
exports.getGame = async (req, res, next) => {
  try {
    let game = await gameService.getGame();
    var data = {
      game: game,
    };

    res.status(200).json(successResponse(true, 200, "Game", data));
  } catch (error) {
    next({
      status: 500,
    });
  }
};
exports.gameStart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(validationResponse(errors));
    }
    let gameStart = await gameService.gameStart(req.body, req.user);
    if (gameStart.code === 200) {
      return res
        .status(200)
        .json(successResponse(true, 200, "Game Start", gameStart.data));
    } else if (gameStart.code === 404) {
      return res
        .status(200)
        .json(successResponse(true, 404, "Game Not Found", null));
    } 
    else if (gameStart.code === 405) {
      return res
        .status(200)
        .json(successResponse(true, 405, "Not Enough Coin", null));
    } 
    else if (gameStart.code === 415) {
      return res
        .status(200)
        .json(successResponse(true, 405, "No Game Mode Found", null));
    } 
    else {
      throw new Error();
    }
  } catch (error) {
    console.log(error)
    next({
      status: 500,
    });
  }
};
exports.gameOver = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json(validationResponse(errors));
        }
        let gameOver=await gameService.gameOver(req.body,req.user);
        if(gameOver.code===200){
            return res.status(200).json(successResponse(true, 200, "Game Over Info", gameOver.data));
        }else if(gameOver.code===406){
            return res.status(200).json(successResponse(false, 406, "Match Not found", null));
        }else{
            throw new Error();
        }
    } catch (error) {
      console.log(error)
        next({
            status: 500,
          });
    }
};
