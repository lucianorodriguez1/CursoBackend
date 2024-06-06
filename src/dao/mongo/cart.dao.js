import cartModel from "./models/cart.model.js";

export default class Cart {
  constructor() {}

  async get() {
    try {
      return await cartModel.find();
    } catch (error) {
      console.log(error); 
    }
  }
  async getById(id) {
    try {
      return await cartModel.findById(id).populate("products.prodId").lean();
    } catch (error) {
      console.log(error);
    } 
  }
  async create() {
    try {
      return await cartModel.insertMany();
    } catch (error) {
      console.log(error);
    }
  }

  async addProd(cid, pid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");

      const productExists = cart.products.findIndex(
        (prod) => prod.prodId._id == pid
      );
      if (productExists == -1) {
        let response = await cartModel.updateOne(
          { _id: cid },
          { $push: { products: { prodId: { _id: pid }, quantity: 1 } } }
        );
      } else {
        let response = await cartModel.updateOne(
          {
            _id: cid,
            "products.prodId": pid,
          },
          { $inc: { "products.$.quantity": 1 } }
        );
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  }
  async deleteAll(cid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");
      const update = await cartModel.updateOne(
        { _id: cid },
        { $set: { products: [] } }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async delete(cid, pid) {
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
  async updateAll(cid, products) {
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
  async update(cid, pid, quantity) {
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

