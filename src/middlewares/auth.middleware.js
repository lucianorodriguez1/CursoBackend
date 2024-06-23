import CustomError from "../services/errors/CustomError.js";
import {ErrorCodes} from "../services/errors/enums.js";

export function authorization(...allowedRoles){
  return async(req,res,next)=>{
    if(!req.user){
        CustomError.createError({
          name: "no autenticado",
          cause: "no existe req.user",
          message: "Error authorization middleware",
          code: ErrorCodes.AUTHENTICATION_ERROR
        });
    }
    if (!allowedRoles.includes(req.user.user.role)) {
      CustomError.createError({
        name: "sin permisos",
        cause: "no hay permisos",
        message: "Error authorization middleware",
        code: ErrorCodes.AUTHORIZATION_ERROR,
      });
    }
    next();
  }
}


