import userModel from "./models/user.model.js";

export default class User {
  constructor() {}

  async get() {
    return await userModel.find();
  }
  async getById(id) {
    return await userModel.findOne({ _id: id }).select('-password -__v -_id');
  }

  async getByEmail(email) {
    return await userModel.findOne({ email: email });
  }
  async create(data) {
    return await userModel.insertMany(data);
  }
  async delete(id){
    return await userModel.findOneAndDelete({ _id: id });
  }
  async update(id,data){
    return await userModel.findOneAndUpdate({ _id: id },
      { ...data },
      { new: true }
    );
  }
}
