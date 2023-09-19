const PenService = require('../services/PenService');
const { successResponse } = require('../util/ResponseUtill');
const penService=new PenService();

exports.penAdd = async (req, res, next) => {
    try {
      let pen = await penService.penAdd();
      if (pen.code === 200) {
        return res
          .status(200)
          .json(successResponse(true, 200, "Pen Send Success", null));
      } else if (pen.code === 404) {
        return res
          .status(200)
          .json(successResponse(false, 404, "Pen Not add", null));
      } else {
        throw new Error();
      }
    } catch (error) {
      next({
        status: 500,
      });
    }
  };

exports.penList = async (req, res, next) => {
    try {
      let pens = await penService.penList();
      var data = {
        pens: pens,
      };
  
      res.status(200).json(successResponse(true, 200, "Pen List", data));
    } catch (error) {
      next({
        status: 500,
      });
    }
  };
exports.penUnlockOrPurchaseOrSelect = async (req, res, next) => {
    try {
        let penId = req.body.penId;
        let type = req.body.type;
      let pen = await penService.penUnlockOrPurchaseOrSelect(penId,type,req.user);
      console.log(pen)
      if (pen.code === 200) {
        return res
          .status(200)
          .json(successResponse(true, 200, "Success", null));
      } else if (pen.code === 407) {
        return res
          .status(200)
          .json(successResponse(false, 407, "Can't Purchase", null));
      }
      else if (pen.code === 408) {
        return res
          .status(200)
          .json(successResponse(false, 408, "Can't Selected", null));
      }
      else if (pen.code === 409) {
        return res
          .status(200)
          .json(successResponse(false, 409, "Pen not found", null));
      } 
      else if (pen.code === 410) {
        return res
          .status(200)
          .json(successResponse(false, 410, "Can't Unlock", null));
      }  else {
        throw new Error();
      }
    } catch (error) {
        console.log(error)
      next({
        status: 500,
      });
    }
  };