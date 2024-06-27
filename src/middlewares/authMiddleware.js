import CustomError from "../services/errors/CustomError.js";
import {ErrorCodes} from "../services/errors/enums.js";

export function authorization(...allowedRoles){
  return async(req,res,next)=>{
    if (!req.user) {
      try {
        CustomError.createError({
          name: "no autenticado",
          cause: "no existe req.user",
          message: "Error authorization middleware",
          code: ErrorCodes.AUTHENTICATION_ERROR
        });
      } catch (error) {
        return next(error); 
      }
    }
    if (!allowedRoles.includes(req.user.user.role)) {
      try {
        CustomError.createError({
          name: "sin permisos",
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


