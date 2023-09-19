const GiftService = require("../services/GiftService");
const { successResponse } = require("../util/ResponseUtill");
const giftService = new GiftService();

exports.sendGift = async (req, res, next) => {
  try {
    let gift = await giftService.sendGift(req.body, req.user);
    if (gift.code === 200) {
      return res
        .status(200)
        .json(successResponse(true, 200, "Gift Send Success", null));
    } else if (gift.code === 404) {
      return res
        .status(200)
        .json(successResponse(false, 404, "No Firends Found", null));
    } else {
      throw new Error();
    }
  } catch (error) {
    next({
      status: 500,
    });
  }
};
exports.requestGift = async (req, res, next) => {
  try {
    let gift = await giftService.requestGift(req.body, req.user);
    if (gift.code === 200) {
      return res
        .status(200)
        .json(successResponse(true, 200, "Request Send Success", null));
    } else if (gift.code === 404) {
      return res
        .status(200)
        .json(successResponse(false, 404, "No Firends Found", null));
    } else {
      throw new Error();
    }
  } catch (error) {
    next({
      status: 500,
    });
  }
};
