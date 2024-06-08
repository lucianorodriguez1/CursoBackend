import cartModel from "./models/cart.model.js";
import productModel from "./models/product.model.js";
import ticketModel from "./models/ticket.model.js";
import userModel from "./models/user.model.js";
import { v4 as uuidv4 } from "uuid";

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

  async purchase(cid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      let totalPrice;
      let prodsNoProcesados = [];
      let isTicket = false;
      let prodsProcesados = [];

      if (!cart) {
        return "Cart not found"
      }

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
    } catch (error) {
      console.log("error en el purcharse dao: " + error);
    }
  }
}
