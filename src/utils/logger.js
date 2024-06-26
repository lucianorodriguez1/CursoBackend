import winston from "winston";
import config from "../config/config.js";
import path from 'path'

const __dirname = path.resolve();

const customsLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "orange",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

const devLogger = winston.createLogger({
  levels: customsLevelsOptions.levels,
  transports: [new winston.transports.Console({ level: "debug" })],
});

const prodLogger = winston.createLogger({
  levels: customsLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
    }),
    new winston.transports.File({
      level: "error",
      filename: `${__dirname}/src/logs/errors.log`,
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = config.environment == "production" ? prodLogger : devLogger;
  req.logger.http(`${new Date().toDateString()} ${req.method} ${req.url}`);
  next();
};
 