const winston = require("winston");

const logLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
};

const developmentLogger = winston.createLogger({
  levels: logLevels,
  level: "debug",
  transports: [new winston.transports.Console()],
});

const productionLogger = winston.createLogger({
  levels: logLevels,
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
    }),
  ],
});

const loggersLevels = {
  development: developmentLogger,
  production: productionLogger,
};

function setLogger(req, res, next) {
  req.logger = loggersLevels[`${process.env.NODE_ENV}`];
  next();
}

module.exports = {setLogger}
