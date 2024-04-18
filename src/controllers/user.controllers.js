import { userManager } from "../dao/MongoDB/managers/user.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userManager.getUsers();
    res.json(users);
  } catch (error) {
    console.log(error);
  } 
};

export const getUser = async (req, res) => {};

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
        password,
        rol: "admin",
      });
    } else {
      newUser = await userManager.createUser({
        first_name,
        last_name,
        age,
        email,
        password,
      });
    }

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
  }
};
