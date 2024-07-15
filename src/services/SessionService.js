import { generateAuthToken } from "../utils/jwt.js";
import { isValidPassword } from "../utils/bcrypt.js";
import CustomError from "../utils/errors/CustomError.js";
import { ErrorCodes } from "../utils/errors/enums.js";
import usersServices from "./UserService.js";
import UserDTO from "../dto/UserDto.js";
import { usersRepository } from "../repositories/index.js";

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
    await usersRepository.updateUserBy(user._id, {
      isOnline: true,
    });

    const token = generateAuthToken(user);
    return {
      token: token,
      message: "Login correct",
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
    await usersServices.updateUserById(user._id, { isOnline: true },data.role,data.email);
    await usersServices.updateUserById(user._id, {
      isOnline: true,
    },data.role,data.email);
    const token = generateAuthToken(user);
    return {
      token: token,
      message: "Register correct",
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
    },req.user.data.role,req.user.data.email);

    return {
      cookie: "coderCookieToken",
      message: "Logout correct",
    };
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

  async deleteInactive() {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const result = await usersRepository.deleteMany({
      last_connection: { $lt: twoDaysAgo },
    });

    if (result.deletedCount > 0) {
      return `Usuarios eliminados: ${result.deletedCount}`;
    } else {
      return "No se encontraron usuarios inactivos para eliminar.";
    }
  }
}

const sessionService = new SessionService();
export default sessionService;
