const { check } = require("express-validator");

module.exports = class ValidationUtill {
  static playerValidate = [
    check("name")
      .trim()
      .escape()
      .custom((value, { req }) => {
        if (req.body.fbId) {
          if (value == "") {
            throw new Error("Name is required");
          } else if (value.length < 3) {
            throw new Error("Name at least 3 digit");
          } else if (value.length > 50) {
            throw new Error("Name at max 50 digit");
          } else {
            return true;
          }
        } else {
          return true;
        }
      }),
    check("duId").not().isEmpty().withMessage("Device id Required"),
    check("firebaseToken")
      .not()
      .isEmpty()
      .withMessage("Firrbase Token Required"),
    check("pictureUrl").custom((value, { req }) => {
      if (req.body.fbId) {
        if (value === "") {
          throw new Error("Picture is required");
        } else {
          return true;
        }
      } else {
        return true;
      }
    }),
  ];
  static gameStartValidate = [
    check("gameMode").not().isEmpty().withMessage("Game Mode Required"),
    check("totalPlayer")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Total Player Required"),
  ];
  static gameOverValidate = [
    check("matchId").trim().not().isEmpty().withMessage("Match Id Required"),
    check("position").trim().not().isEmpty().withMessage("Position Required")
  ];
};
