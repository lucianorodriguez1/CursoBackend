import { decodedToken, decodeTokenWithoutVerify } from "../utils/jwt.js";
import { usersRepository } from "../repositories/index.js";
import config from "../config/config.js";

const updateUserOnTokenExpiration = async (token) => {
  const decoded = decodeTokenWithoutVerify(token);
  const email = decoded.data.email;

  const user = await usersRepository.getUserBy({ email: email });
  if (user) {
    const fecha = new Date().toISOString();
    await user.updateUserById(
      user._id,
      {
        last_connection: fecha,
        isOnline: false,
      },
      user.role,
      user.email
    );
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
    await updateUserOnTokenExpiration(token);
    res.clearCookie(config.tokenCookie);
    next();
  }
};

export default tokenExpirationMiddleware;
