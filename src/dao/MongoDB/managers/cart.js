import cartModel from "../models/cart.js";

 class CartMongoDBManager {
  constructor() {}

  async getCarts() {
    try {
      return await cartModel.find();
    } catch (error) {
      console.log(error);
    }
  }
  async getCartPopulate(id) {
    try {
      return await cartModel.findById(id).populate("products.prodId").lean();
    } catch (error) {
      console.log(error);
    }
  }
  async createCart() {
    try {
      return await cartModel.insertMany();
    } catch (error) {
      console.log(error);
    }
  }

  async addProductFromCart(cid, pid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");

      
      const update = await cartModel.updateOne(
        { _id: cid },
        { $push: { products:{prodId:pid, quantity:1}} }
      );

      return true;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteAllProductsFromCartById(cid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");
      const update = await cartModel.updateOne(
        { _id: cid },
        { $set: { "products":[] } }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async deleteProductCart(cid, pid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");

      const update = await cartModel.updateOne(
        { _id: cid },
        {
          $pull: { products: { prodId: pid } },
        }
      );

      console.log(update);
      return true;
    } catch (error) {
      console.log(error);
    }
  }
  async updateCartById(cid, products) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");
      const update = await cartModel.updateMany(
        { _id: cid },
        { $set: { products: products } }
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }
  async updateProductCart(cid, pid, quantity) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");

      const update = await cartModel.updateOne(
        { _id: cid, "products._id": pid },
        { $set: { "products.$.quantity": quantity } }
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}

export const cartManager = new CartMongoDBManager();
