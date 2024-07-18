import jwt from "jsonwebtoken";
import config from "../config/config.js";
import CustomError from "../utils/errors/CustomError.js";
import {ErrorCodes} from "../utils/errors/enums.js";

export const generatePasswordResetToken = (data) => {
  const token = jwt.sign( {data},config.tokenKey, { expiresIn: "5m" });
  return token;
};

export const generateAuthToken = (data) => {
  const token = jwt.sign( {data},config.tokenKey, { expiresIn: "1h" });
  return token;
};


export const decodedToken = (token) =>{
  try {
    const decoded = jwt.verify(token, config.tokenKey);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      CustomError.createError({
        name: "Token expirado",
        cause: "Token expired",
        message: "El token ha expirado",
        code: ErrorCodes.TOKEN_EXPIRED
      });
    } else if (error.name === 'JsonWebTokenError') {
      throw CustomError.createError({
        name: "Invalid Token",
        cause: "Invalid token",
        message: "El token es inválido",
        code: ErrorCodes.INVALID_TOKEN
      });
    } else {
      throw CustomError.createError({
        name: "Token Error",
        cause: "Token error",
        message: "Error en el token",
        code: ErrorCodes.TOKEN_ERROR
      });
    }
  }
}

export const decodeTokenWithoutVerify = (token) => {
  return jwt.decode(token);
};