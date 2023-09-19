const Game = require("../models/Game");
const Player = require("../models/Player");

module.exports = class LeaderBoardService {
  globalLeaderBoard = async (gamePlayer) => {
    try {
      //global all leaderboards
      // let players=await Player.
      let players = await Player.find({},'_id name level pictureUrl avatarSelected pictureUrl currentXP totalWinCoin currentLevelXP')
        .sort({ "totalWinCoin": -1 })
        .limit(20);
      var _globalLeaderboard = players.slice(0,50).reduce(function (
        filtered,
        option,
        index
      ) {
        // console.log(option.avatarSelected)
        let someNewValue = {
          position: index + 1,
          id: option._id,
          name: option.name,
          level: option.level,
          pictureUrl: option.pictureUrl,
          avatarSelected: option.avatarSelected!=undefined?option.avatarSelected:option.pictureUrl,
          currentXP: option.currentXP,
          targetXP:
            option.level == 0
              ? 20
              : option.currentLevelXP + Math.round(option.currentLevelXP * 0.1),
          coin: option.totalWinCoin,
        };
        filtered.push(someNewValue);
        return filtered;
      },
      []);
      //all players for find my position
      // let allPlayers = await Player.find().sort({ "totalWinCoin": -1 });
      const globalPlayerIndex = players.findIndex((player) => {
        return JSON.stringify(player._id) === JSON.stringify(gamePlayer._id);
      });
      // console.log(globalPlayerIndex);
      let myPosition=0;
      if(globalPlayerIndex==-1){
         myPosition = await Player.find({totalWinCoin:{$gt:gamePlayer.totalWinCoin}},'_id')
        .countDocuments();
        myPosition=myPosition+1;
      }else{
        myPosition=globalPlayerIndex+1;
      }
      let globalMyInfo = null;
      globalMyInfo = {
        position: myPosition,
        id: gamePlayer._id,
        name: gamePlayer.name,
        level: gamePlayer.level,
        pictureUrl: gamePlayer.pictureUrl,
        avatarSelected: gamePlayer.avatarSelected!=undefined?gamePlayer.avatarSelected:gamePlayer.pictureUrl,
        currentXP: gamePlayer.currentXP,
        targetXP:
          gamePlayer.level == 0
            ? 20
            : gamePlayer.currentLevelXP +
              Math.round(gamePlayer.currentLevelXP * 0.1),
        coin:gamePlayer.totalWinCoin,
      };

      // friends all leaderboards
      let player = await Player.findOne({ _id: gamePlayer._id })
        .populate({ path: "friends.friendId" })
        .sort({
          "friends.friendId.totalWinCoin": -1
        })
        .exec()
        .then((player) => player);

      if (player.friends.length > 0) {
        let leaderboard = player.friends.reduce(function (filtered, option) {
          let someNewValue = {
            id: option.friendId._id,
            name: option.friendId.name,
            level: option.friendId.level,
            pictureUrl: option.friendId.pictureUrl,
            avatarSelected: option.friendId.avatarSelected!=undefined?option.friendId.avatarSelected:option.friendId.pictureUrl,
            currentXP: option.friendId.currentXP,
            targetXP:
              option.friendId.level == 0
                ? 20
                : option.friendId.currentLevelXP +
                  Math.round(option.friendId.currentLevelXP * 0.1),
            coin: option.friendId.totalWinCoin,
          };
          filtered.push(someNewValue);
          return filtered;
        }, []);
        let myInfo = {
          id: player._id,
          name: player.name,
          level: player.level,
          pictureUrl: player.pictureUrl,
          avatarSelected: player.avatarSelected!=undefined?player.avatarSelected:player.avatarSelected,
          currentXP: player.currentXP,
          targetXP:
            player.level == 0
              ? 20
              : player.currentLevelXP +
                Math.round(player.currentLevelXP * 0.1),
          coin: player.totalWinCoin,
        };
        leaderboard.push(myInfo);
        leaderboard.sort(
          this.firstBy(function (v1, v2) {
            return v2.coin - v1.coin;
          }).thenBy(function (v1, v2) {
            return v1.lastWinTimeStamp > v2.lastWinTimeStamp;
          })
        );
        let leaderboardMap = leaderboard.map((player, index) => {
          return {
            position: index + 1,
            id: player.id,
            name: player.name,
            level: player.level,
            pictureUrl: player.pictureUrl,
            avatarSelected: player.avatarSelected,
            currentXP: player.currentXP,
            targetXP: player.level,
            coin: player.coin,
          };
        });
        const playerIndex = leaderboardMap.findIndex((player) => {
          return JSON.stringify(player.id) === JSON.stringify(gamePlayer._id);
        });
        let friendMyFullInfo = null;
        if (playerIndex >= 0) {
          friendMyFullInfo = leaderboardMap[playerIndex];
        }
        let data = {
          globalLeaderBoard: {
            leaderboard: _globalLeaderboard,
            myInfo: globalMyInfo,
          },
          friendsLeaderBoard: {
            leaderboard: leaderboardMap,
            myInfo: friendMyFullInfo,
          },
        };
        return {
          code: 200,
          data: data,
        };
      } 
      else {
        let data = {
          globalLeaderBoard: {
            leaderboard: _globalLeaderboard,
            myInfo: globalMyInfo,
          },
          friendsLeaderBoard: null,
        };
        return {
          code: 200,
          data: data,
        };
      }
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  };

  firstBy = (function () {
    function e(f) {
      f.thenBy = t;
      return f;
    }

    function t(y, x) {
      x = this;
      return e(function (a, b) {
        return x(a, b) || y(a, b);
      });
    }

    return e;
  })();
};
