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

  async getUserByEmail(email){
    try {
      return await userModel.findOne({email:email})
    } catch (error) {
      console.log(error)
    }
  }
  async createUser(data) {
    try {
      return await userModel.insertMany(data);
    } catch (error) {
      console.log(error);
    }
  }
}

export const userManager = new UserMongoDBManager();
