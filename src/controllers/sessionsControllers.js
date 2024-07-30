import config from "../config/config.js";
import { generateAuthToken } from "../utils/jwt.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import UserDTO from "../dao/dto/UserDto.js";
import { cartsRepository, usersRepository } from "../repositories/index.js";
import userModel from "../dao/mongo/models/userModel.js";

export async function login(req, res) {
  const { email, password } = req.body;

  //        ------ Verify credentials ------
  const user = await usersRepository.getUserBy({ email: email });
  if (!user) {
    return res
      .status(404)
      .json({ succes: false, message: "Credentials invalids" });
  }

  if (!isValidPassword(user, password)) {
    return res
      .status(404)
      .json({ succes: false, message: "Credentials invalids" });
  }

  // --------------------------

  //IF CREDENTIALS VALIDS

  await usersRepository.updateUserBy(
    { _id: user._id },
    {
      isOnline: true,
    }
  );

  const token = generateAuthToken(user);
  res.cookie(config.tokenCookie, token, {
    maxAgre: 60 * 60 * 1000,
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Login correct" });
}

export async function register(req, res) {
  const { first_name, last_name, age, email, password } = req.body;

  // Verify if exists user with email by body
  let user = await usersRepository.getUserBy({ email: email });
  if (user) {
    return res
      .status(404)
      .json({ succes: false, message: "User with email exists" });
  }
  /**
   * IF USER NOT EXISTSS
   *
   *
   */
  // Hash password
  const passwordHash = createHash(password);

  // Create cart for User
  const cartObject = await cartsRepository.createCart();
  const cartId = cartObject[0]._id;

  const newUser = {
    first_name: first_name,
    last_name: last_name,
    age: age,
    email: email,
    password: passwordHash,
    cartId: cartId,
  };

  //Create User
  await usersRepository.createUser(newUser);
  user = await usersRepository.getUserBy({ email: email });
  await usersRepository.updateUserBy({ _id: user._id }, { isOnline: true });

  const token = generateAuthToken(user);
  res.cookie(config.tokenCookie, token, {
    maxAgre: 60 * 60 * 1000,
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Register correct" });
}

export async function logout(req, res) {
  const email = req.user.data.email;
  const user = await usersRepository.getUserBy({ email: email });
  const fecha = new Date().toISOString();

  await usersRepository.updateUserBy(
    { _id: user._id },
    { last_connection: fecha, isOnline: false }
  );

  res.clearCookie(config.tokenCookie);
  res.status(200).json({ success: true, message: "Logout correct" });
}

// --- RESPONSE USER'S DATA
export async function current(req, res) {
  const result = await UserDTO.getUserResponseForCurrent(req.user.data);
  res.status(200).json({ success: true, data: result });
}

async function seeTheLastConnectionsOfUsers() {
  const usersToDisplay = await userModel.find();

  if (usersToDisplay.length > 0) {
    usersToDisplay.forEach((user) => {
      const lastConnection = new Date(user.last_connection);
      const timeDiff = now - lastConnection;

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      let timeAgo = "";
      if (days > 0) {
        timeAgo += `${days} día${days > 1 ? "s" : ""} `;
      }
      if (hours > 0 || days > 0) {
        timeAgo += `${hours} hora${hours > 1 ? "s" : ""} `;
      }
      if (minutes > 0 || hours > 0 || days > 0) {
        timeAgo += `${minutes} minuto${minutes > 1 ? "s" : ""} `;
      }

      console.log(`Usuario: ${user.email}`);
      console.log(`Última sesión: ${lastConnection}`);
      console.log(`Inactivo desde: ${timeAgo.trim()}`);
      console.log("---");
    });
  }
}

// Delete users with 2 or more days of inactivity
export async function deleteInactives(req, res) {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const dateDelete = 'two days ago'

  const result = await usersRepository.deleteMany({
    last_connection: { $lt: twoDaysAgo },
  });

  if (result.deletedCount > 0) {
    res.status(200).json({
      success: true,
      data: result,
      message: `Deleted users: ${result.deletedCount}. With last connection more than ${dateDelete}`,
      
    });
  } else {
    res.status(404).json({
      success: false,
      data: result,
      message: `No inactive users found to delete with last connection more than ${dateDelete}`,
    });
  }
}
