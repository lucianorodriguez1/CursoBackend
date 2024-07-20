import cartModel from "./models/cartModel.js";

export default class Cart {
  constructor() {}

  async get() {
    return await cartModel.find();
  }
  async getById(id) {
    return await cartModel.findById(id).populate("products.prodId").lean();
  }
  async create() {
    return await cartModel.insertMany();
  }

  async addProd(cid, pid) {
    const cart = await cartModel.findOne({ _id: cid });
    let response;
    const productExists = cart.products.findIndex(
      (prod) => prod.prodId._id == pid
    );
    if (productExists == -1) {
       response = await cartModel.updateOne(
        { _id: cid },
        { $push: { products: { prodId: { _id: pid }, quantity: 1 } } }
      );
    } else {
       response = await cartModel.updateOne(
        {
          _id: cid,
          "products.prodId": pid,
        },
        { $inc: { "products.$.quantity": 1 } }
      );
    }
    return response;
  }

  async deleteAll(cid) {
      const response = await cartModel.updateOne(
      { _id: cid },
      { $set: { products: [] } }
    );
    return response;
  }

  async delete(cid, pid) {
    const result = await cartModel.updateOne(
      { _id: cid },
      {
        $pull: { products: { prodId: pid } },
      }
    );
    return result;
  }

  async updateAll(cid, products) {
    const result = await cartModel.updateMany(
      { _id: cid },
      { $set: { products: products } }
    );
    return result;
  }

  async update(cid, pid, quantity) {
    const update = await cartModel.updateOne(
      { _id: cid, "products.prodId": pid },
      { $set: { "products.$.quantity": quantity } }
    );
    return update;
  }
  async deleteCart(cid){
    return await cartModel.findByIdAndDelete(cid);
  }
  async removeDeletedProducts(pid){
    return await cartModel.updateMany(
      { "products.prodId": pid },
      { $pull: { products: { prodId: pid } } }
    );
  }
}
