import UserDTO from "../dto/UserDto.js";
import { usersRepository } from "../repositories/index.js";
import { cartsRepository } from "../repositories/index.js";
import { createHash } from "../utils/bcrypt.js";
import { decodedToken, generateToken } from "../utils/jwt.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import config from "../config/config.js";
import { transport } from "../utils/nodemailer.js";

class UserService {
  constructor() {}

  async getUsers(req) {
    const users = await usersRepository.getUsers();
    const result = users.map((user) =>
      UserDTO.getUserResponseForRole(user, req.user.user.role)
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

  async getUserByEmail(email) {
    let result = await usersRepository.getUserByEmail(email);
    return result;
  }
  async deleteUserById(id) {
    const user = await this.getUserById(id);
    let cartDelete = await cartsRepository.deleteCartById(user.cartId);
    let result = await usersRepository.deleteUserById(id);
    return result;
  }
  async updateUserById(id, data) {
    await this.getUserById(id);
    this.removeEmptyFields(data);
    let result = await usersRepository.updateUserById(id, data);
    return result;
  }
  removeEmptyFields(obj) {
    for (let key in obj) {
      if (
        obj[key] === null ||
        obj[key] === undefined ||
        obj[key] === "" ||
        (Array.isArray(obj[key]) && obj[key].length === 0) ||
        (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
      ) {
        delete obj[key];
      }
    }
    return obj;
  }

  async changePremium(id) {
    await this.getUserById(id);
    let result = await usersRepository.updateUserById(id, { role: "premium" });
    return result;
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

    console.log(lastConnectionDate)
    console.log(currentDate)
    console.log(thirtyMinutesAgo)
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

  async sendEmailToResetPassword(email){
    await userService.getUserByEmail(email);
    const token = generateToken({email:email})
    const resetLink = `http://localhost:${config.port}/reestablecerContrasenia?token=${token}`;
    const  result = await transport.sendMail({
      from: `lucho rodri <${config.correoGmail}>`,
      to: email,
      subject: "Reestablecer contraseña",
      html: `
          <div>
              <a href="${resetLink}">Reestablecer mi contraseña</a>
          </div>
          `,
          attachments:[]
    });
    return result;
  }

  async resetPassword(token, password) {
    const decoded = decodedToken(token);
    const email = decoded.email;
    const user = await userService.getUserByEmail(email);
    const passwordHash = createHash(password);
    console.log("user:" + user)
    await this.updateUserById(user._id, { password: passwordHash });
    return 'Se cambio la contraseña con exito';
  }

}

const userService = new UserService();
export default userService;
