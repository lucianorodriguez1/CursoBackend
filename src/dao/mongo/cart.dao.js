import cartModel from "./models/cart.model.js";
import productModel from "./models/product.model.js";
import ticketModel from "./models/ticket.model.js";
import userModel from "./models/user.model.js";
import { v4 as uuidv4 } from "uuid";

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
      { _id: cid, "products._id": pid },
      { $set: { "products.$.quantity": quantity } }
    );
    return result;
  }

  async purchase(cid) {
    const cart = await cartModel.findOne({ _id: cid });
    let totalPrice;
    let prodsNoProcesados = [];
    let isTicket = false;
    let prodsProcesados = [];

    for (const item of cart.products) {
      const productId = item.prodId._id;
      const product = await productModel.findById(item.prodId);
      const quantity = item.quantity;
      let updatedProduct;

      if (product.stock < quantity) {
        prodsNoProcesados.push(productId);
      } else {
        updatedProduct = await productModel.findOneAndUpdate(
          { _id: productId, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } },
          { new: true }
        );
      }

      if (updatedProduct) {
        totalPrice = updatedProduct.price * quantity;
        isTicket = true;
        prodsProcesados.push(productId);
        await this.delete(cid, productId);
      }
    }

    const user = await userModel.findOne({ cartId: cid });
    let ticket;

    if (isTicket) {
      ticket = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: totalPrice,
        purchaser: user.email,
      };
      await ticketModel.insertMany(ticket);
    }

    await cart.save();
    return {
      productosProcesados: prodsProcesados,
      productosNoProcesados: prodsNoProcesados,
    };
  }
}
