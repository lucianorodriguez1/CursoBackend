import { decodedToken, decodeTokenWithoutVerify } from "../utils/jwt.js";
import userService from "../services/UserService.js";
import CustomError from "../services/errors/CustomError.js";
import {ErrorCodes} from "../services/errors/enums.js";

const updateUserOnTokenExpiration = async (token) => {
  const decoded = decodeTokenWithoutVerify(token);
  const email = decoded.data.email;

  const user = await userService.getUserByEmail(email);
  if (user) {
    console.log("entre")
    const fecha = new Date().toISOString();
    await userService.updateUserById(user._id, {
      last_connection: fecha,
      isOnline: false,
    });
  }
};

const tokenExpirationMiddleware = async (req, res, next) => {
  const token = req.cookies["coderCookieToken"];
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
