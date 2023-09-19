const LeaderBoardService = require("../services/LeaderBoardService");
const { successResponse } = require("../util/ResponseUtill");
const leaderBoardService = new LeaderBoardService();

exports.globalLeaderBoard = async (req, res, next) => {
  try {
    let gamePlayer = req.user;
    let leaderboard = await leaderBoardService.globalLeaderBoard(
      gamePlayer
    );
    if (leaderboard.code === 200) {
      return res
        .status(200)
        .json(successResponse(true, 200, "Leaderboards", leaderboard.data));
    } else {
      throw new Error();
    }
  } catch (error) {
      console.log(error)
    next({
      status: 500,
    });
  }
};
