import usersServices from "../services/usersServices.js";
import { createHash } from "../utils/bcrypt.js";
import { response } from "../utils/response.js";

export const getUsers = async (req, res) => {
  const users = await usersServices.getUsers();
  response(res, 200, users);
};

export const getUser = async (req, res) => {
  const id = req.params.uid;
  const user = await usersServices.getUserById(id);
  response(res, 200, user);
};

export const createUser = async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;

  const passwordHash = createHash(password);

  const newUser = await usersServices.createUser({
    first_name,
    last_name,
    age,
    email,
    password: passwordHash,
  });

  response(res,201,newUser);
};
