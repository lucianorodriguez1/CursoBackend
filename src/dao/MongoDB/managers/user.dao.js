import userModel from "../models/user.model.js";

class UserMongoDBManager {
  constructor() {}

  async getUsers() {
    try { 
      return await userModel.find();
    } catch (error) {
      console.log(error);
    }
  }
  async getUserById(id) {
    try {
      return await userModel.findOne({ _id: id });
    } catch (error) {
      console.log(error);
    }
  }

  async getUserByEmail(email) {
    try {
      return await userModel.findOne({ email: email });
    } catch (error) {
      console.log(error);
    }
  }
  async createUser(data) {
    try {
      return await userModel.insertMany(data);
    } catch (error) {
      if (error.code === 11000) {
        // Lanzar un error más descriptivo 
        throw new Error(
          "Duplicate key error: a user with this email already exists."
        );
      } else {
        // Lanzar otros errores
        throw new Error("Error");
      }
    }
  }
  
}

export const userManager = new UserMongoDBManager();
