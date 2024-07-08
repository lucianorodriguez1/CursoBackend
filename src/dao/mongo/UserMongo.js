import userModel from "./models/userModel.js";

export default class User {
  constructor() {}

  async get() {
    return await userModel.find();
  }
  async getById(id) {
    return await userModel.findOne({ _id: id })
  }
  async getByEmail(email) {
    return await userModel.findOne({ email: email });
  }
  async getByCart(cartId) {
    return await userModel.findOne({ cartId: cartId });
  }
  async create(data) {
    return await userModel.insertMany(data);
  }
  async delete(id){
    return await userModel.findOneAndDelete({ _id: id });
  }
  async deleteMany(cond){
    return await userModel.deleteMany(cond);
  }
  async update(id,data){
    return await userModel.findOneAndUpdate({ _id: id },
      { ...data },
      { new: true }
    );
  }
}
