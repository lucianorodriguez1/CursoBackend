import UserDTO from "../dto/UserDto.js";
import { usersRepository } from "../repositories/index.js";
import { cartsRepository } from "../repositories/index.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { decodedToken, generatePasswordResetToken } from "../utils/jwt.js";
import CustomError from "../utils/errors/CustomError.js";
import { ErrorCodes } from "../utils/errors/enums.js";
import config from "../config/config.js";
import { transport } from "../utils/nodemailer.js";
import { removeEmptyObjectFields } from "../utils/removeEmptyObjectFields.js";

class UserService {
  constructor() {}

  async getUsers(role, email) {
    const users = await usersRepository.getUsers();
    const result = await Promise.all(
      users.map(async (user) =>
        UserDTO.getUserResponseForRole(user, role, email)
      )
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

  async getUserById(id, role, email) {
    let result = await usersRepository.getUserBy({ _id: id });
    if (!result)
      CustomError.createError({
        name: "user no encontrado",
        cause: "invalid id",
        message: "Error get user",
        code: ErrorCodes.INVALID_ID,
      });
    const userDto = await UserDTO.getUserResponseForRole(result, role, email);
    return userDto;
  }

  async getUserByCart(cartId) {
    let result = await usersRepository.getUserBy({ cartId: cartId });
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
    let result = await usersRepository.getUserBy({ email: email });
    return result;
  }

  async deleteUserById(id) {
    const user = await usersRepository.getUserBy({ _id: id });
    if (!user)
      CustomError.createError({
        name: "user no encontrado",
        cause: "invalid id de cart",
        message: "Error get user  by car",
        code: ErrorCodes.INVALID_ID,
      });
    await cartsRepository.deleteCartById(user.cartId);
    await usersRepository.deleteUserBy({ _id: id });
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

  async updateUserById(id, data, role, email) {
    const user = await usersRepository.getUserBy({ _id: id });
    if (!user)
      CustomError.createError({
        name: "user no encontrado",
        cause: "invalid id",
        message: "Error get user",
        code: ErrorCodes.INVALID_ID,
      });
    if (user.email != email && role != "admin") {
      CustomError.createError({
        name: "sin permisos para editar el usuario",
        cause: "se trato de acceder a un endpoint sin authorizacion",
        message: "Error update user by id",
        code: ErrorCodes.INVALID_ID,
      });
    }
    removeEmptyObjectFields(data);
    await usersRepository.updateUserBy({ _id: id }, data);
    return "se actualizo el user";
  }

  async changePremium(uid) {
    const user = await usersRepository.getUserBy({ _id: uid });
    if (!user)
      CustomError.createError({
        name: "user no encontrado",
        cause: "invalid id de cart",
        message: "Error get user in changePremium",
        code: ErrorCodes.INVALID_ID,
      });
      
    const requiredDocuments = [
      "identification",
      "proofOfResidence",
      "accountStatement",
    ];
    const userDocumentTypes = user.documents.map((doc) => doc.name);

    const hasAllDocuments = requiredDocuments.every((doc) =>
      userDocumentTypes.includes(doc)
    );

    if (!hasAllDocuments) {
      return "the necessary documents were not uploaded";
    }

    await usersRepository.updateUserBy({ _id: uid }, { role: "premium" });
    return "se actualizo el rol del user a premium";
  }

  async sendEmailToResetPassword(email) {
    await userService.getUserByEmail(email);
    const token = generatePasswordResetToken({ email: email });
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
    await usersRepository.updateUserBy(
      { _id: user._id },
      { password: passwordHash }
    );
    return "Se cambio la contraseña con exito";
  }

  async uploadProfilePhoto(uid, photo) {
    const user = await usersRepository.getUserBy({ _id: uid });
    if (!user) {
      return "User not found";
    }
    const updateData = {
      profilePhoto: {
        name: photo.originalname,
        reference:`/img/profiles/${photo.filename}`,
      },
    };
    await usersRepository.updateUserBy({ _id: uid }, updateData);
    return "profile photo was uploaded";
  }

  async uploadDocuments(uid, files) {
    if (!files) {
      return "No hay archivos.";
    }

    const documentsToAdd = [];

    const fileFields = [
      "identification",
      "proofOfResidence",
      "accountStatement",
    ];

    fileFields.forEach((field) => {
      if (files[field]) {
        files[field].forEach((file) => {
          documentsToAdd.push({
            name: field,
            originalname: file.originalname,
            reference: file.path,
          });
        });
      }
    });

    if (documentsToAdd.length === 0) {
      return "No hay archivos válidos.";
    }

    const updateData = {
      $push: {
        documents: {
          $each: documentsToAdd,
        },
      },
    };

    await usersRepository.updateUserBy({ _id: uid }, updateData);
    return "upload documents";
  }
}

const userService = new UserService();
export default userService;
