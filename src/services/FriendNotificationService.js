const Player = require("../models/Player");

module.exports = class FriendNotificationService {
  static sendFriendOnlineNotification(id, webSockets) {
    Player.findOne({ _id: id })
      .populate("friends.friendId")
      .exec((err, player) => {
        if (err) {
          throw new Error(err);
        }
        let friends = player.friends;
        let newFriends = [];
        friends.forEach((friend) => {
          if (webSockets.hasOwnProperty(friend.friendId.userId)) {
            let message = {
              eventType: "friendOnline",
              message: "Friend Online",
              data: {
                friendId: friend.friendId.fbId,
              },
            };
            webSockets[friend.friendId.userId].send(JSON.stringify(message));
            friend.onlineStatus = true;
            friend.friendId = friend.friendId._id;
            newFriends.push(friend);
          } else {
            friend.friendId = friend.friendId._id;
            newFriends.push(friend);
          }
        });
        player.friends = newFriends;
        player.save();
      });
  }
  static sendFriendOfflineNotification(id, webSockets) {
    Player.findOne({ _id: id })
      .populate("friends.friendId")
      .exec((err, player) => {
        if (err) {
          throw new Error(err);
        }
        let friends = player.friends;
        let newFriends = [];
        friends.forEach((friend) => {
          if (webSockets.hasOwnProperty(friend.friendId.userId)) {
            let message = {
              eventType: "friendOffline",
              message: "Friend Offline",
              data: {
                friendId: friend.friendId.fbId,
              },
            };
            webSockets[friend.friendId.userId].send(JSON.stringify(message));

            friend.onlineStatus = true;
            friend.friendId = friend.friendId._id;
            newFriends.push(friend);
          } else {
            friend.friendId = friend.friendId._id;
            newFriends.push(friend);
          }
        });
        player.friends = newFriends;
        player.save();
      });
  }
  sendOnlinePushNotification() {}
};
