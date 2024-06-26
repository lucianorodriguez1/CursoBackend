import usersServices from "../services/usersServices.js";
import { response } from "../utils/response.js";

export const getUsers = async (req, res) => {
  const users = await usersServices.getUsers(req);
  response(res, 200, users);
};

export const getUser = async (req, res) => {
  const id = req.params.uid;
  const user = await usersServices.getUserById(id);
  response(res, 200, user);
};

export const createUser = async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;

  const newUser = await usersServices.createUser({
    first_name,
    last_name,
    age,
    email,
    password,
  });

  response(res, 201, newUser);
};

export const deleteUser = async (req, res) => {
 const id = req.params.uid;
  const result = await usersServices.deleteUserById(id);
  response(res, 200, "user eliminado");
};

export const updateUser = async (req, res) => {
  const  id  = req.params.uid;
  const { first_name, last_name, age, email, password } = req.body;

  const result = await usersServices.updateUserById(id, {
    first_name,
    last_name,
    age,
    email,
    password,
  });
  response(res, 200, result);
};

export const changePremium = async (req,res) => {
  const id = req.params.uid;

  const result = await usersServices.changePremium(id);

  response(res,200,result);
}
