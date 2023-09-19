const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const passport = require("passport");

const routes = require("../routes");
const logger = require("../services/Logger");
const config = require("../config");
const SocketServer = require("./SocketServer");
const requestIp = require("request-ip");
const cors = require("cors");
const Passport = require("../middlewares/Passport");



class ExpressLoader {
  constructor() {
    const app = express();

    // Set up middleware
    app.use(morgan("dev"));
    app.use(
      express.urlencoded({
        extended: false,
        limit: "20mb",
      })
    );
    app.use(express.json({ limit: "20mb" }));

    app.use(cors());
    app.use(requestIp.mw())
    app.use(passport.initialize())
    new Passport().initialize(passport)
    // Pass app to routes
    routes(app);
    app.use((req, res, next) => {
      next({
        status: 404,
      });
    });
    // Setup error handling, this must be after all other middleware
    app.use(ExpressLoader.errorHandler);

    var http = require("http").Server(app);
    //socket configure
    new SocketServer(http);
    // Start application
    this.server = http.listen(config.port, () => {
      console.log(`Express running, now listening on port ${config.port}`);
      // logger.info( `Express running, now listening on port ${config.port}` );
    });
  }

  get Server() {
    return this.server;
  }

  /**
   * @description Default error handler to be used with express
   * @param error Error object
   * @param req {object} Express req object
   * @param res {object} Express res object
   * @param next {function} Express next object
   * @returns {*}
   */
  static errorHandler(error, req, res, next) {
    let parsedError;
    console.log(error);
    // Attempt to gracefully parse error object
    try {
      if (error && typeof error === "object") {
        parsedError = JSON.stringify(error);
      } else {
        parsedError = error;
      }
    } catch (e) {
      logger.error(e);
    }

    // Log the original error
    logger.error(parsedError);

    // If response is already sent, don't attempt to respond to client
    if (res.headersSent) {
      return next(error);
    }

    let message = "Internal Server Error";
    if (error.status === 404) {
      message = "Not found";
    }
    var data = {
      status: false,
      code: error.status,
      message: message,
      data: null,
    };
    res.status(error.status).json(data);
  }
}

module.exports = ExpressLoader;
