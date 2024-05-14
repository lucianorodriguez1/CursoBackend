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
  async getUserById(id){
    try {
      return await userModel.findOne({_id:id});
    } catch (error) {
      console.log(error)
    }
  }

  async getUserByEmail(email){
    try {
      return await userModel.findOne({email:email})
    } catch (error) {
      console.log(error)
    }
  }
  /*
  async getUserByEmail(email){
    try {
      const user = await userModel.findOne({email:email});
      delete user.password;
      return user;
    } catch (error) {
      console.log(error)
    }
  }
  */
  async createUser(data) {
    try {
      return await userModel.insertMany(data);
    } catch (error) {
      console.log(error);
    }
  }
}


export const userManager = new UserMongoDBManager();
