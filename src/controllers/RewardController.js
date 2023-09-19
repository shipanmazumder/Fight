const RewardService = require("../services/RewardService");
const { successResponse } = require("../util/ResponseUtill");

const rewardService = new RewardService();

exports.rewardAdd = async (req, res, next) => {
  try {
    let games = await rewardService.rewardAdd();
    res.status(200).json(successResponse(true, 201, "Rewards Add", games));
  } catch (error) {
    next({
      status: 500,
    });
  }
};
exports.rewardList = async (req, res, next) => {
  try {
    let rewards = await rewardService.rewardList();
    res.status(200).json(successResponse(true, 200, "Rewards List", rewards));
  } catch (error) {
    next({
      status: 500,
    });
  }
};
exports.verifyRewardAds = async (req, res, next) => {
  try {
    let gift = await rewardService.verifyRewardAds(req.body, req.user);
    if (gift.code === 200) {
      return res
        .status(200)
        .json(successResponse(true, 200, "Reward Add Success", gift.data));
    } else if (gift.code === 411) {
      return res
        .status(200)
        .json(successResponse(true, 411, "No reward type found", null));
    }else if (gift.code === 412) {
      return res
        .status(200)
        .json(successResponse(true, 412, "No Reward Available", null));
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
