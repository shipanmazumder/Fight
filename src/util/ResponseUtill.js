const SocketServer = require("../loaders/SocketServer");

module.exports = class ResponseUtill {
  /**
   *
   * @param error
   * @returns {{errors: *}}
   */
  static validationResponse(error) {
    return { errors: error.mapped() };
  }

  /**
   *
   * @param error
   * @returns {{code, data: null, message: string, status: boolean}}
   */
  static errorResponse(error) {
    let message = "Internal Server Error";
    if (error.status === 404) {
      message = "Not found";
    }
    return {
      status: false,
      code: error.status,
      message: message,
      data: null,
    };
  }

  /**
   *
   * @param status {boolean}
   * @param code {int}
   * @param message {string}
   * @param data {object}
   * @returns {{code, data, message, status}}
   */
  static successResponse(status, code, message, data) {
    return {
      status: status,
      code: code,
      message: message,
      data: data,
    };
  }

  static socketResponse(ids, eventType, message, data) {
    let socketMessage = {
      eventType: eventType,
      message: message,
      data: data,
    };
    SocketServer.broadcast(ids, socketMessage);
  }
};
