const config = {
  dbUrl: process.env.DATABASE_URL || "mongodb://localhost/test-db",
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  logDir: process.env.LOGDIR || "logs",
  viewEngine: process.env.VIEW_ENGINE || "html"
};

module.exports = config;