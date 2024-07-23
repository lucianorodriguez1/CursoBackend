import CustomError from "../utils/errors/CustomError.js";
import {ErrorCodes} from "../utils/errors/enums.js";

export function authorization(...allowedRoles){
  return async(req,res,next)=>{
    if (!req.user) {
      try {
        CustomError.createError({
          name: "Unauthenticated",
          cause: "no existe req.user",
          message: "Error authorization middleware",
          code: ErrorCodes.AUTHENTICATION_ERROR
        });
      } catch (error) {
        return next(error); 
      }
    }
    if (!allowedRoles.includes(req.user.data.role)) {
      try {
        CustomError.createError({
          name: "Unauthorized",
          cause: "no hay permisos",
          message: "Error authorization middleware",
          code: ErrorCodes.AUTHORIZATION_ERROR,
        });
      } catch (error) {
        return next(error); 
      }
    }
    next();
  }
}

export function authorizationViewCreateProduct(...allowedRoles){
  return async(req,res,next)=>{
    if (!req.user) {
      try {
        return res.render("not-available")
      } catch (error) {
        return next(error); 
      }
    } 
    if (!allowedRoles.includes(req.user.data.role)) {
      try {
        return res.render("changeRole")
      } catch (error) {
        return next(error); 
      }
    }
    next();
  }
}


