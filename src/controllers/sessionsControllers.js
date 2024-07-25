import config from "../config/config.js";
import { generateAuthToken } from "../utils/jwt.js";
import { isValidPassword } from "../utils/bcrypt.js";
import UserDTO from "../dto/UserDto.js";
import { usersRepository } from "../repositories/index.js";

export async function login(req, res) {
  const { email, password } = req.body;

  //        ------ Verify credentials ------
  const user = await usersRepository.getUserBy({ email: email });
  if (!user) {
    res.status(404).json({ succes: false, message: "Credentials invalids" });
  }

  if (!isValidPassword(user, password)) {
    res.status(404).json({ succes: false, message: "Credentials invalids" });
  }

  // --------------------------

  //IF CREDENTIALS VALIDS

  await usersRepository.updateUserBy(user._id, {
    isOnline: true,
  });

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
    res.status(404).json({ succes: false, message: "User with email exists" });
  }

  await usersRepository.createUser({
    first_name,
    last_name,
    age,
    email,
    password,
  });

  user = await usersServices.getUserByEmail(email);

  await usersRepository.updateUserBy({ _id: user._id }, { isOnline: true });
  const token = generateAuthToken(user);

  res.cookie(config.tokenCookie, token, {
    maxAgre: 60 * 60 * 1000,
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Register correct" });
}

export async function logout(req, res) {
  const user = await usersServices.getUserByEmail(email);
  const fecha = new Date().toISOString();

  await usersRepository.updateUserBy(
    { _id: user._id },
    { last_connection: fecha, isOnline: false }
  );

  res.clearCookie(config.tokenCookie);
  res.status(200).json({ success: true, message: "Logout correct" });
}

export async function current(req, res) {
  const result = UserDTO.getUserResponseForCurrent(req.user.data);

  res.status(200).json({ success: true, data: result });
}


// Delete users with 2 or more days of inactivity
export async function deleteInactives(req, res) {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const result = await usersRepository.deleteMany({
    last_connection: { $lt: twoDaysAgo },
  });

  if (result.deletedCount > 0) {
    res
      .status(200)
      .json({
        success: true,
        data: result,
        message: `Usuarios eliminados: ${result.deletedCount}`,
      });
  } else {
    res
      .status(404)
      .json({
        success: false,
        data: result,
        message: "no inactive users found to delete",
      });
  }
}
