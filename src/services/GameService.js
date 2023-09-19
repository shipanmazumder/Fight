const { customAlphabet } = require("nanoid");
const Game = require("../models/Game");
const {
  locationGenerate,
  maleNameGenerate,
  femaleNameGenerate,
  fackeNameGenerate,
} = require("../util/Facker");
const { getRandomInt, randomIntFromInterval } = require("../util/Helpers");
const Match = require("../models/Match");
const { collectXP } = require("../util/GamePrizeCalculation");
const Facker = require("../util/Facker");

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

module.exports = class GameService {
  async gameAdd() {
    let gameData = [
      {
        name: "Pen Figth",
        gameUniqueId: 1001,
        gameMode: [
          {
            modeName: "Primary School",
            modeAmount: 500,
            winAmount: 1000,
            winXP: 50,
            loseXP: 25,
          },
          {
            modeName: "High School",
            modeAmount: 1000,
            winAmount: 2000,
            winXP: 100,
            loseXP: 30,
          },
          {
            modeName: "College Campus",
            modeAmount: 1500,
            winAmount: 3000,
            winXP: 150,
            loseXP: 70,
          },
          {
            modeName: "Varsity Campus",
            modeAmount: 2000,
            winAmount: 4000,
            winXP: 200,
            loseXP: 90,
          },
          {
            modeName: "Street Pen Fight",
            modeAmount: 2500,
            winAmount: 5000,
            winXP: 250,
            loseXP: 110,
          },
        ],
      },
    ];
    try {
      return await Game.insertMany(gameData);
    } catch (error) {
      throw new Error(err);
    }
  }

  async getGame() {
    try {
      return await Game.findOne();
    } catch (error) {
      throw new Error(error);
    }
  }
  async gameStart(body, user) {
    try {
      let totalPlayer = body.totalPlayer;
      let gameMode = body.gameMode;
      let playerTotalWinCoin = user.totalWinCoin;
      let game = await Game.findOne();
      if (!game) {
        return { code: 404, data: null };
      }
      let gameModeInfo = game.gameMode.find(
        (mode) => mode.modeName === gameMode
      );
      if (typeof gameModeInfo === "undefined") {
        return { code: 415, data: null };
      }
      if (user.currentCoin < gameModeInfo.modeAmount) {
        return { code: 405, data: null };
      }
      let tempMatchId = nanoid();
      while (await Match.findOne({ matchUniqueId: tempMatchId })) {
        tempMatchId = nanoid();
      }
      let fakePlayers = [];
      fakePlayers = fackeNameGenerate(totalPlayer);

      let players = [];
      let tempPlayers = [];
      let level_min = parseInt(user.level / 3);
      let level_max = level_min + 3;
      for (var i = 0; i < fakePlayers.length; i++) {
        let level = randomIntFromInterval(level_min, level_max);
        let currentLevelXP = user.currentLevelXP;
        let totalPlayedMatch = user.totalPlayedMatch;
        let totalWinMatch = user.totalWinMatch;
        let diffLevel = 0;
        if (user.level > level) {
          diffLevel = user.level - level;
        } else {
          diffLevel = level - user.level;
        }
        if (user.level == 0) {
          currentLevelXP = 50;
          diffLevel = diffLevel - 1;
        }
        if (level < 12) {
          currentLevelXP = Facker.targetXp[level];
        } else {
          if (currentLevelXP >= 600) {
            currentLevelXP = 600;
          } else {
            currentLevelXP = currentLevelXP + 50;
          }
        }
        if (level > user.level) {
          // for (var j = 0; j < diffLevel - 1; j++) {
          //   currentLevelXP += currentLevelXP * 0.1;
          // }
          totalWinMatch = randomIntFromInterval(
            totalWinMatch,
            totalPlayedMatch
          );
        } else if (level < user.level) {
          // for (var j = 0; j < diffLevel - 1; j++) {
          //   currentLevelXP -= currentLevelXP * 0.1;
          // }

          if (totalPlayedMatch > 3) {
            totalPlayedMatch = randomIntFromInterval(
              totalPlayedMatch - 3,
              totalPlayedMatch
            );
          } else {
            totalPlayedMatch = randomIntFromInterval(1, 3);
          }
        }
        if (totalPlayedMatch < 3) {
          totalPlayedMatch = randomIntFromInterval(
            totalPlayedMatch + 1,
            totalPlayedMatch + 3
          );
        } else {
          totalPlayedMatch = randomIntFromInterval(
            totalPlayedMatch - 1,
            totalPlayedMatch + 3
          );
        }
        totalWinMatch = randomIntFromInterval(totalWinMatch, totalPlayedMatch);
        playerTotalWinCoin = randomIntFromInterval(
          playerTotalWinCoin + 1000,
          playerTotalWinCoin + 2000
        );
        currentLevelXP = Math.round(currentLevelXP);
        let location = locationGenerate();
        let currentWinStreak=randomIntFromInterval(0,totalWinMatch);
        let tempPlayer = {
          name: fakePlayers[i].name,
          country: location.country,
          city: location.city,
          pictureUrl: fakePlayers[i].pictureUrl,
          avatarSelected: fakePlayers[i].pictureUrl,
          totalPlayedMatch: totalPlayedMatch,
          totalWinMatch: totalWinMatch,
          currentWinStreak: currentWinStreak,
          bestWinStreak: randomIntFromInterval(currentWinStreak,totalWinMatch),
          worldRank: randomIntFromInterval(50000,20000),
          currentXP: randomIntFromInterval(5, 19),
          level: level,
          currentLevelXP: level === 0 ? 0 : currentLevelXP,
          targetXP:
            level < 12
              ? Facker.targetXp[level]
              : currentLevelXP >= 600
              ? 600
              : currentLevelXP + 50,
          totalWinCoin: playerTotalWinCoin,
        };
        players.push(tempPlayer);
        delete tempPlayer.currentLevelXP;
        tempPlayer.avatarSelected =  fakePlayers[i].pictureUrl;
        tempPlayer.frameSelected = randomIntFromInterval(1, 5);
        tempPlayer.bannerSelected = randomIntFromInterval(1, 5);
        tempPlayer.inventory = null;
        tempPlayers.push(tempPlayer);
      }
      let match = new Match({
        matchUniqueId: tempMatchId,
        userId:user.userId,
        winXP: gameModeInfo.winXP,
        loseXP: gameModeInfo.loseXP,
        gameMatchCoin: gameModeInfo.modeAmount,
        gameModeName: gameModeInfo.modeName,
        totalPlayers: totalPlayer,
        players: players,
      });
      user.currentCoin = user.currentCoin - gameModeInfo.modeAmount;
      user.hasPlayedAnyGame=true;
      await user.save();

      // await Match.deleteOne({ userId: user.userId });
      let matchDetails = await match.save();
      var data = {
        matchInfo: {
          matchId: matchDetails.matchUniqueId,
          gameMatchCoin: matchDetails.gameMatchCoin,
          matchWinCoin: this.gameCoinCollection(
            true,
            matchDetails.gameMatchCoin
          ),
          players: tempPlayers,
        },
      };
      return { code: 200, data: data };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  async gameOver(body, user) {
    let matchId = body.matchId;
    let position = body.position;
    let winStatus = false;
    let player = user;
    let match = await Match.findOne({ matchUniqueId: matchId });
    if (!match) {
      return { code: 406, data: null };
    }
    if (position == 1) {
      winStatus = true;
    }
    let getXPInfo = collectXP(match, player, winStatus);
    // console.log(getXPInfo)
    // let game = await Game.findOne();
    let gameAchieveCoin = this.gameCoinCollection(
      winStatus,
      match.gameMatchCoin
    );
    // let gameAchieveCoin=gameCoinCollection(winStatus,match.gameMatchCoin);
    let gamePlayInfo = this.gamePlayHistory(
      player,
      winStatus,
      match.gameModeName,
      match.totalPlayers,
      position,
      gameAchieveCoin
    );


    let totalPlayedMatch = player.totalPlayedMatch+1;

    let newCoin = player.totalWinCoin + gameAchieveCoin;
    let currentWinStreak=winStatus?player.currentWinStreak+1:0;
    let bestWinStreak=player.bestWinStreak<currentWinStreak?currentWinStreak:player.bestWinStreak;
    player.level = getXPInfo.currentLevel;
    player.currentLevelXP = getXPInfo.currentLevelXP;
    player.currentXP = getXPInfo.currentXP;
    player.currentCoin = gamePlayInfo.currentTotalCoin;
    player.totalPlayedMatch=totalPlayedMatch;
    player.currentWinStreak=currentWinStreak;
    player.bestWinStreak=bestWinStreak;
    player.totalWinMatch = winStatus
      ? parseInt(player.totalWinMatch) + 1
      : player.totalWinMatch;
    player.totalWinCoin = newCoin;

    player.playHistory.push(gamePlayInfo.playHistory);

    let result = await player.save();

    // await Match.deleteOne({ userId: user.userId });
    let totalWinMatch = player.totalWinMatch;
    let totalLoseMatch = totalPlayedMatch - totalWinMatch;
    let data = {
      player: {
        name: result.name,
        fbId: result.fbId,
        userId: result.userId,
        pictureUrl: result.pictureUrl,
        currentCoin: result.currentCoin,
        totalWinCoin: result.totalWinCoin,
        currentXP: result.currentXP,
        currentXPIncrease: getXPInfo.currentXPIncrease,
        targetXP:
          result.level < 12
            ? Facker.targetXp[result.level]
            : result.currentLevelXP >= 600
            ? 600
            : result.currentLevelXP + 50,
        level: result.level,
        totalWinMatch: result.totalWinMatch,
      },
      gameInfo: {
        totalPlayedMatch: totalPlayedMatch,
        totalWinMatch: totalWinMatch,
        totalLoseMatch: totalLoseMatch,
      },
    };
    return { code: 200, data: data };
  }

  gameCoinCollection = (winStatus, mode_amount) => {
    let currentMatchCoin = 0;
    if (winStatus) {
      currentMatchCoin = mode_amount * 2;
    }
    return currentMatchCoin;
  };
  gamePlayHistory = (
    player,
    winStatus,
    gameModeName,
    totalPlayer,
    position,
    gameAchieveCoin
  ) => {
    let currentTotalCoin = player.currentCoin + gameAchieveCoin;
    return {
      currentTotalCoin: currentTotalCoin,
      playHistory: {
        position: position,
        gameMode: gameModeName,
        winStatus: winStatus,
        coin: gameAchieveCoin,
        totalPlayer: totalPlayer,
      },
    };
  };
};
