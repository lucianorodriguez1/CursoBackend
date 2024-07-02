import UserDTO from "../dto/UserDto.js";
import { usersRepository } from "../repositories/index.js";
import { cartsRepository } from "../repositories/index.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { decodedToken, generateToken } from "../utils/jwt.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import config from "../config/config.js";
import { transport } from "../utils/nodemailer.js";
import { removeEmptyObjectFields } from "../utils/removeEmptyObjectFields.js";

class UserService {
  constructor() {}

  async getUsers(role) {
    const users = await usersRepository.getUsers();
    const result = users.map((user) =>
      UserDTO.getUserResponseForRole(user, role)
    );
    return result;
  }
  async createUser(user) {
    const passwordHash = createHash(user.password);
    const cartObject = await cartsRepository.createCart();
    const cartId = cartObject[0]._id;
    const newUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
      password: passwordHash,
      cartId: cartId,
    };
    const result = await usersRepository.createUser(newUser);
    return result;
  }
  async getUserById(id) {
    let result = await usersRepository.getUserById(id);
    if (!result)
      CustomError.createError({
        name: "user no encontrado",
        cause: "invalid id",
        message: "Error get user",
        code: ErrorCodes.INVALID_ID,
      });
    return result;
  }
  async getUserByCart(cartId) {
    let result = await usersRepository.getUserByCart(cartId);
    if (!result)
      CustomError.createError({
        name: "user no encontrado",
        cause: "invalid id de cart",
        message: "Error get user  by car",
        code: ErrorCodes.INVALID_ID,
      });
    return result;
  }
  async getUserByEmail(email) {
    let result = await usersRepository.getUserByEmail(email);
    return result;
  }
  async deleteUserById(id) {
    const user = await this.getUserById(id);
    await cartsRepository.deleteCartById(user.cartId);
    await usersRepository.deleteUserById(id);
    await transport.sendMail({
      from: `lucho rodri <${config.correoGmail}>`,
      to: user.email,
      subject: "User eliminado",
      html: `
          <div>
              <p>Tu usuario fue eliminado.</p>
          </div>
          `,
      attachments: [],
    });
    return "user eliminado";
  }
  async updateUserById(id, data) {
    await this.getUserById(id);
    removeEmptyObjectFields(data);
    await usersRepository.updateUserById(id, data);
    return "se actualizo el user";
  }

  async changePremium(id) {
    await this.getUserById(id);
    await usersRepository.updateUserById(id, { role: "premium" });
    return "se actualizo el rol del user a premium";
  }
  async sendEmailToResetPassword(email) {
    await userService.getUserByEmail(email);
    const token = generateToken({ email: email });
    const resetLink = `http://localhost:${config.port}/reestablecerContrasenia?token=${token}`;
    const result = await transport.sendMail({
      from: `lucho rodri <${config.correoGmail}>`,
      to: email,
      subject: "Reestablecer contraseña",
      html: `
          <div>
              <a href="${resetLink}">Reestablecer mi contraseña</a>
          </div>
          `,
      attachments: [],
    });
    return {
      infoEnvio: result,
      message: "Envio de correo exitoso",
    };
  }

  async resetPassword(token, password) {
    const decoded = decodedToken(token);
    const email = decoded.data.email;
    const user = await userService.getUserByEmail(email);
    if (isValidPassword(user, password)) {
      CustomError.createError({
        name: "La contraseña es la misma. Introduce otra.",
        cause:
          "la contraseña que se quiere reestablecer es la misma del usuario",
        message: "Contraseña repetido",
        code: ErrorCodes.REPEATED_PASSWORD,
      });
    }
    const passwordHash = createHash(password);
    console.log("user: " + user);
    await this.updateUserById(user._id, { password: passwordHash });
    return "Se cambio la contraseña con exito";
  }
  
  async deleteInactive() {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const user = await usersRepository.getUserById("6678f20e85b706c0f070f8a5");
    if (!user) {
      return "Usuario no encontrado.";
    }
    const lastConnectionDate = new Date(user.last_connection);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - lastConnectionDate.getTime();
    console.log(lastConnectionDate);
    console.log(currentDate);
    console.log(thirtyMinutesAgo);
    console.log(`Diferencia de tiempo en milisegundos: ${timeDifference}`);
    const result = await usersRepository.deleteMany({
      last_connection: { $lt: thirtyMinutesAgo },
    });
    console.log(result);
    if (result.deletedCount > 0) {
      return `Usuarios eliminados: ${result.deletedCount}`;
    } else {
      return "No se encontraron usuarios inactivos para eliminar.";
    }
  }
}

const userService = new UserService();
export default userService;
