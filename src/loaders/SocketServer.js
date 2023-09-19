const WebSocket = require("ws");
const fs = require("fs");

var jwt = require("jsonwebtoken");
const FriendNotificationService = require("../services/FriendNotificationService");
 
var webSockets = {};
var privateKey = fs.readFileSync("./jwtRS256.key");
module.exports = class SocketServer {
  constructor(server) {
    const wss = new WebSocket.Server({
      server: server,
      verifyClient: function (info, cb) {
        const urlParams = new URLSearchParams(info.req.url);
        const myParam = urlParams.get("/?token");
        var token = myParam;
        if (!token) cb(false, 401, "Unauthorized");
        else {
          jwt.verify(token, privateKey, function (err, decoded) {
            if (err) {
              cb(false, 401, "Unauthorized");
            } else {
              info.req.socketUser = decoded; //[1]
              cb(true);
            }
          });
        }
      },
    });

    wss.on("connection", async (ws, req) => {
      var socketUser = req.socketUser;
      var socketUserId = socketUser.data.userId;
      console.log("connect")
      webSockets[socketUserId] = ws;
      FriendNotificationService.sendFriendOnlineNotification(
        socketUserId,
        webSockets
      );
      ws.on("message", (messages) => {
        let message = JSON.parse(messages);
        message.channels.forEach((channel) => {
          if (webSockets.hasOwnProperty(channel))
            webSockets[channel].send(JSON.stringify(message.message));
        });
      });
      ws.on("close", function () {
        console.log("disconnet")
        delete webSockets[socketUserId];
        FriendNotificationService.sendFriendOfflineNotification(socketUserId,webSockets);
      });
    });
  }
  static broadcast = (channelName, message) => {
    channelName.forEach((channel) => {
      if (webSockets.hasOwnProperty(channel)){
        webSockets[channel].send(JSON.stringify(message));
      }
    });
  };
};
