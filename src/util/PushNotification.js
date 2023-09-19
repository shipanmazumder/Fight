var axios = require("axios");
module.exports = class PushNotification {
   static async sendPushNotification(ids, title, body, url) {
    var data = JSON.stringify({
      registration_ids: ids,
      notification: {
        title: title,
        body: body,
        mutable_content: true,
        sound: "Tri-tone",
      },
      data: {
        url: url,
        dl: "<deeplink action on tap of notification>",
      },
    });

    var config = {
      method: "post",
      url: "https://fcm.googleapis.com/fcm/send",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${process.env.SERVER_KEY}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};
