import UserDTO from "../DTO/user.dto.js";
import { usersRepository } from "../repositories/index.js";
import { cartsRepository } from "../repositories/index.js";
import { createHash } from "../utils/bcrypt.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
/* prueba del codigo comentado
import config from "../config/config.js";
import { transport } from "../utils/nodemailer.js";
*/

class UserService {
  constructor() {}

  async getUsers(req) {
    const users = await usersRepository.getUsers();
    const result = users.map(user=>UserDTO.getUserResponseForRole(user,req.user.user.role))
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

  /*PRUEBA

  async restorePassword(email){
    let result = await transport.sendMail({
      from: `lucho rodri <${config.correoGmail}>`,
      to: `${email}`,
      subject: "Reestablecer contrasenia e-commerce",
      html: `
          <div>
              <a href="http://localhost:${config.port}/reestablecerContrasenia">Reestablecer mi contrasenia</a>
          </div>
          `,
          attachments:[]
    });
    return result;
  }
  */
}

const usersServices = new UserService();
export default usersServices;
