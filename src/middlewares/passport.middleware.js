import passport from "passport";
import CustomError from "../services/errors/CustomError.js";
import { ErrorCodes } from "../services/errors/enums.js";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        req.user =  null;
        next();
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};
