const Facker = require("./Facker");

var xpCollect = [
  {
    win: 100,
    lose: 50,
  },
  {
    win: 50,
    lose: 25,
  },
  {
    win: 50,
    lose: 25,
  },
  {
    win: 40,
    lose: 20,
  },
  {
    win: 40,
    lose: 20,
  },
  {
    win: 25,
    lose: 12,
  },
  {
    win: 25,
    lose: 12,
  },
  {
    win: 20,
    lose: 10,
  },
  {
    win: 20,
    lose: 10,
  },
  {
    win: 10,
    lose: 5,
  },
];


module.exports = class GamePrizeCalculation {
  /**
   *
   * @param {object} match
   * @param {object} player
   * @param {boolean} win_status
   */
  static collectXP = (match, player, win_status) => {
    
    let initialXP = 0;
    let currentLevel = player.level;
    let currentXP = player.currentXP;
    let currentLevelXP = player.currentLevelXP;
      if (win_status) {
        initialXP = match.winXP;
      } else {
        initialXP =match.loseXP;
      }
    let totalXP = Math.round(initialXP + currentXP);

    let nextLevelXP = GamePrizeCalculation.getNextLevelXP(currentLevel,currentLevelXP);

    if (nextLevelXP <= totalXP) {
        currentLevel = currentLevel + 1;
        currentXP = Math.round(totalXP - nextLevelXP);
        currentLevelXP = Math.round(nextLevelXP);
        let newNextLevelXP=GamePrizeCalculation.getNextLevelXP(currentLevel,currentLevelXP);
      while(currentXP>=newNextLevelXP){
        currentLevel = currentLevel + 1;
        currentXP = Math.round(currentXP - newNextLevelXP);
        currentLevelXP = Math.round(newNextLevelXP);
        newNextLevelXP=GamePrizeCalculation.getNextLevelXP(currentLevel,currentLevelXP);
      }
    } else {
      currentXP = Math.round(totalXP);
    }
    return {
      currentXPIncrease:initialXP,
      currentXP: currentXP,
      currentLevel: currentLevel,
      currentLevelXP: currentLevelXP,
    };
  };
  /**
   * 
   * @param {*} currentLevel 
   * @returns 
   */
  static getNextLevelXP=(currentLevel,currentLevelXP)=>{
    let nextLevelXP = 50;
    if (currentLevel < 12) {
      nextLevelXP = Facker.targetXp[currentLevel];
    } else {
      if(currentLevelXP>=600){
        nextLevelXP=600;
      }else{
        nextLevelXP = currentLevelXP + 50;
      }
    }
    return nextLevelXP;
  }
  /**
   *
   * @param {object} match
   * @param {object} player
   * @param {boolean} win_status
   */
  static collectXPOld = (match, player, win_status) => {
    let nextLevelXP = 20;
    let initialXP = 0;
    let currentBucketLevel = parseInt(player.level / 10);
    let currentLevel = player.level;
    let currentXP = player.currentXP;
    let currentLevelXP = player.currentLevelXP;
    if (win_status === true) {
      initialXP = match.winXP;
    } else {
      initialXP = match.loseXP;
    }
    let currentMatchXPGain = initialXP + initialXP * (0.1 * currentBucketLevel);
    let totalXP = Math.round(currentMatchXPGain + currentXP);
    if (currentLevel > 0) {
      nextLevelXP = currentLevelXP + Math.round(currentLevelXP * 0.1);
    }
    if (nextLevelXP <= totalXP) {
      currentLevel = currentLevel + 1;
      currentXP = Math.round(totalXP - nextLevelXP);
      currentLevelXP = Math.round(nextLevelXP);
    } else {
      currentXP = Math.round(totalXP);
    }
    return {
      currentXP: currentXP,
      currentLevel: currentLevel,
      currentLevelXP: currentLevelXP,
    };
  };
};
