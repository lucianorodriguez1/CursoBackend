import { generateToken } from "../utils/jwt.js";
import { isValidPassword } from "../utils/bcrypt.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import usersServices from "./UserService.js";
import UserDTO from "../dto/UserDto.js";

class SessionService {
  constructor() {}

  async login(email, password) {
    const user = await usersServices.getUserByEmail(email);
    if (!user) {
      CustomError.createError({
        name: "credenciales incorrectas",
        cause: "email y contraseña no coinciden",
        message: "Credenciales incorrectas",
        code: ErrorCodes.AUTHENTICATION_ERROR,
      });
    }
    if (!isValidPassword(user, password)) {
      CustomError.createError({
        name: "credenciales incorrectas",
        cause: "email y contraseña no coinciden",
        message: "Credenciales incorrectas",
        code: ErrorCodes.AUTHENTICATION_ERROR,
      });
    }
    await usersServices.updateUserById(user._id, {
      isOnline: true,
    });

    const token = generateToken(user);
    return {
      token:token,
      message:"Login correct"
    };
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
    await usersServices.updateUserById(user._id, {
      isOnline: true,
    });
    const token = generateToken(user);
    return {
      token:token,
      message:"Register correct"
    };
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

    return {
      cookie:'coderCookieToken',
      message:"Logout correct"
    }
    
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
    return UserDTO.getUserResponseForCurrent(req.user.data);
  }

  
}

const sessionService = new SessionService();
export default sessionService;
