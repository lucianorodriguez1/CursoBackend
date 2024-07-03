import userService from "../services/UserService.js";
import { response } from "../utils/response.js";

export const getUsers = async (req, res) => {
  const role = req.user?.data?.role || null;
  const users = await userService.getUsers(role);
  response(res, 200, users);
};

export const getUser = async (req, res) => {
  const id = req.params.uid;
  const role = req.user?.data?.role || null;
  const user = await userService.getUserById(id,role);
  response(res, 200, user);
};

export const createUser = async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;
  const newUser = await userService.createUser({
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
  const result = await userService.deleteUserById(id);
  response(res, 200, result);
};

export const updateUser = async (req, res) => {
  const  id  = req.params.uid;
  const { first_name, last_name, age, email, password } = req.body;

  const result = await userService.updateUserById(id, {
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
  const result = await userService.changePremium(id);
  response(res,200,result);
}

export async function deleteInactives(req, res) {
  const data = await sessionService.deleteInactive();
  response(res, 200, data);
}

export async function sendEmailToResetPassword(req, res) {
  const {email} = req.body;
  const result = await userService.sendEmailToResetPassword(email);
  req.logger.info(result.infoEnvio);
  response(res,200,result.message);
}

export const resetPassword = async(req,res) =>{
  const {token,password} = req.body;
  const result = await userService.resetPassword(token,password);
  response(res, 200, result);
}

export const createDocuments = async(req,res) =>{
  const usuarioId = req.params.uid
  const file = req.file || null;
  const result = await userService.createDocuments(usuarioId,file);
  response(res, 200, result);
}

