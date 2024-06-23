import { generateToken } from "../utils/jwt.js";
import { isValidPassword } from "../utils/bcrypt.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import usersServices from "./usersServices.js";

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
    const token = generateToken(user);
    return token;
  }

  async register(data) {
    const user = await usersServices.getUserByEmail(data.email);
    if(user){
        CustomError.createError({
            name: "email duplicado. vuelva a intentarlo",
            cause: "email proporcionado: " + data.email,
            message: "error en proceso de registro de usuario",
            code: ErrorCodes.DUPLICATE_EMAIL,
          });
    }
    await usersServices.createUser(data);
    const token = generateToken(user);
    return token
  }

  /*
  async logout(req, res) {
    res.clearCookie("coderCookieToken"); //NO FUNCIONA//
  }
*/ 

/*
ERROR: ME MUESTRA LOS ARCHIVOS AL MOMENTO DE QUE NO EXISTE USUARIO EN EL METODO 'current'
*/
  async current(req) {
    if(!req.user){
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
