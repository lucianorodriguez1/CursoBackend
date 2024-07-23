import passport from "passport";
import CustomError from "../utils/errors/CustomError.js";
import { ErrorCodes } from "../utils/errors/enums.js";


export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        try {
          CustomError.createError({
            name: "no se autentico",
            cause: "no hay nadie autenticado",
            message: "Error passportCall middleware",
            code: ErrorCodes.AUTHENTICATION_ERROR,
          });
        } catch (error) {
          return next(error);
        }
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const passportCallView = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        try {
         return res.render("not-available")
        } catch (error) {
          return next(error);
        }
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const passportCallOptional = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);

      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};
