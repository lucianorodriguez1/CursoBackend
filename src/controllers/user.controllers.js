import { userManager } from "../dao/MongoDB/managers/user.dao.js";
import {createHash} from "../utils/bcrypt.js"

export const getUsers = async (req, res) => {
  try {
    const users = await userManager.getUsers();
    res.json(users);
  } catch (error) {
    console.log(error);
  } 
};
export const getUser = async (req, res) => {  
  try {
    const id = req.params.uid;
    const user = await userManager.getUserById(id);
    res.status(200).json({status:"succes",payload:user});
  } catch (error) {
    console.log(error);
  }
};
export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, age, email, password } = req.body;
    let newUser;

    if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
      newUser = await userManager.createUser({
        first_name,
        last_name,
        age,
        email,
        password:createHash(password),
        rol: "admin",
      });
    } else {
      newUser = await userManager.createUser({
        first_name,
        last_name,
        age,
        email,
        password:createHash(password),
      });
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
  }
};
