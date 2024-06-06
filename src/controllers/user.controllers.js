import { usersService } from "../repositories/index.js";
import {createHash} from "../utils/bcrypt.js"

export const getUsers = async (req, res) => {
  try {
    const users = await usersService.getUsers();
    res.json(users);
  } catch (error) {
    console.log(error);
  } 
};
export const getUser = async (req, res) => {  
  try {
    const id = req.params.uid;
    const user = await usersService.getUserById(id);
    res.status(200).json({status:"succes",payload:user});
  } catch (error) {
    console.log(error);
  }
};
export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, age, email, password } = req.body;
    let newUser;
    let passwordHash = createHash(password);

    if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
      newUser = await usersService.createUser({
        first_name,
        last_name,
        age,
        email,
        password:createHash(password),
        rol: "admin",
      });
    } else {
      newUser = await usersService.createUser({
        first_name,
        last_name,
        age,
        email,
        password:passwordHash
      });
    }
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
  }
};
 