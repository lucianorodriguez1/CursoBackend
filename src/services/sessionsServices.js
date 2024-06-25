import { generateToken } from "../utils/jwt.js";
import { isValidPassword } from "../utils/bcrypt.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import usersServices from "./usersServices.js";
import UserDTO from "../DTO/user.dto.js";

class SessionService {
  constructor() {}

  async login(email, password) {
    const user = await usersServices.getUserByEmail(email);
    if (!user) {
      CustomError.createError({
        name: "error de autenticacion",
        cause: "email y contraseña no coinciden",
        message: "Credenciales incorrectas",
        code: ErrorCodes.AUTHENTICATION_ERROR,
      });
    }
    if (!isValidPassword(user, password)) {
      CustomError.createError({
        name: "error de autenticacion",
        cause: "email y contraseña no coinciden",
        message: "Credenciales incorrectas",
        code: ErrorCodes.AUTHENTICATION_ERROR,
      });
    }
    const userUpd=await usersServices.updateUserById(user._id, { isOnline: true });
    //const userDto = UserDTO.getUserTokenFrom(user);
    const token = generateToken(userUpd);
    return token;
  }

  async register(data) {
    let user = await usersServices.getUserByEmail(data.email);
    if (user) {
      CustomError.createError({
        name: "email duplicado. vuelva a intentarlo",
        cause: "email proporcionado: " + data.email,
        message: "error en proceso de registro de usuario",
        code: ErrorCodes.DUPLICATE_EMAIL,
      });
    }
    await usersServices.createUser(data);
    user = await usersServices.getUserByEmail(data.email);
    await usersServices.updateUserById(user._id, { isOnline: true });
    const userUpd=await usersServices.updateUserById(user._id, { isOnline: true });
    const token = generateToken(userUpd);
    return token;
  }

  async logout(req, res, email) {
    if (!req.user) {
      CustomError.createError({
        name: "no se autentico",
        cause: "no hay nadie autenticado",
        message: "Error passportCall middleware",
        code: ErrorCodes.AUTHENTICATION_ERROR,
      });
    }
    const user = await usersServices.getUserByEmail(email);
    const fecha = new Date().toISOString();
    await usersServices.updateUserById(user._id, {
      last_connection: fecha,
      isOnline: false,
    });

    res.clearCookie("coderCookieToken");
  }

  async current(req) {
    if (!req.user) {
      CustomError.createError({
        name: "no se autentico",
        cause: "no hay nadie autenticado",
        message: "Error passportCall middleware",
        code: ErrorCodes.AUTHENTICATION_ERROR,
      });
    }
    return req.user;
  }
}

const sessionService = new SessionService();
export default sessionService;
