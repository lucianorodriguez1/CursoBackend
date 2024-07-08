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
  const role = req.user?.data?.role || null;
  const eCurrent = req.user?.data?.email || null;

  const result = await userService.updateUserById(id, {
    first_name,
    last_name,
    age,
    email,
    password,
  },role,eCurrent);
  response(res, 200, result);
};

export const changePremium = async (req,res) => {
  const id = req.params.uid;
  const result = await userService.changePremium(id,role);
  response(res,200,result);
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
export async function deleteInactives(req, res) {
  const data = await sessionService.deleteInactive();
  response(res, 200, data);
}

export const uploadDocuments = async(req,res) =>{
  const usuarioId = req.params.uid
<<<<<<< HEAD
  const files = req.files || null;
  if (!files || Object.keys(files).length === 0) {
    return res.status(400).send({ message: 'No files were uploaded.' });
  }
  const result = await userService.uploadDocuments(usuarioId,files);
  response(res, 200, result);
}

export const uploadProfilePhoto = async(req,res) =>{
  const usuarioId = req.params.uid
  const photo = req.file || null;
  if (!photo) {
    return res.status(400).send({ message: 'No photo were uploaded.' });
  }
  const result = await userService.uploadProfilePhoto(usuarioId,photo);
=======
  const file = req.file || null;
  const idCurrent = req.user?.data?.id || null;
  const result = await userService.createDocuments(usuarioId,file,idCurrent);
>>>>>>> ce32084a3478323326ffca1f3d8b9b77dbd32258
  response(res, 200, result);
}

