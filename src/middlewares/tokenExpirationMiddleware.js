import { decodedToken, decodeTokenWithoutVerify } from "../utils/jwt.js";
import userService from "../services/UserService.js";
import {ErrorCodes} from "../utils/errors/enums.js";
import config from "../config/config.js";

const updateUserOnTokenExpiration = async (token) => {
  const decoded = decodeTokenWithoutVerify(token);
  const email = decoded.data.email;

  const user = await userService.getUserByEmail(email);
  if (user) {
    const fecha = new Date().toISOString();
    await userService.updateUserById(user._id, {
      last_connection: fecha,
      isOnline: false,
    },user.role,user.email);
  }
};

const tokenExpirationMiddleware = async (req, res, next) => {
  const token = req.cookies[config.tokenCookie];
  if (!token) {
    return next(); 
  }
  try {
    decodedToken(token);
    next();
  } catch (err) {
    if (err.code === ErrorCodes.TOKEN_EXPIRED) {
      await updateUserOnTokenExpiration(token);
      res.clearCookie("coderCookieToken");
    }
    next();
  }
};

export default tokenExpirationMiddleware;
