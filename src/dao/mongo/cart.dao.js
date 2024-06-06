import cartModel from "./models/cart.model.js";
import productModel from "./models/product.model.js";
import ticketModel from "./models/ticket.model.js";
import { v4 as uuidv4 } from 'uuid';
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

  async purchase(cid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      let totalPrice;
      // Recorrer los productos del carrito y realizar las operaciones necesarias
      for (const item of cart.products) {
        const productId = item.prodId._id;
        const product = await productModel.findById(item.prodId)
        const quantity = item.quantity;

        console.log(`Product id: ${productId}`)
        console.log(`Stock: ${product.stock}`)
        console.log(`quantity: ${quantity}`)

        if(product.stock<quantity){
          throw new Error(`Stock Insuficiente. No se pudo realizar la compra.`);
        }
        

        // Usar findOneAndUpdate para restar la cantidad del carrito del stock del producto
        const updatedProduct = await productModel.findOneAndUpdate(
          { _id: productId, stock: { $gte: quantity } }, // Condición: stock suficiente
          { $inc: { stock: -quantity } }, // Operación: decrementar stock
          { new: true } // Opciones: devolver el documento actualizado
        );
        
        if (!updatedProduct) {
          throw new Error(`Not enough stock for product ${item.prodId.title}`);
        }
        
        // Calcular el precio total del producto basado en la cantidad
          totalPrice = updatedProduct.price * quantity;
        
        // Puedes hacer otras operaciones, como sumar el total al total del carrito, etc.
        console.log(
          `Total price for ${quantity} x ${updatedProduct.title}: ${totalPrice}`
        );
        /*
        */
      }
      
      // Opcional: guardar el carrito si realizaste algún cambio en él
      const ticket = {
        code: uuidv4(), // Genera un código único
        purchase_datetime: new Date(),
        amount: totalPrice,
        purchaser: "correo",
      };

      await ticketModel.insertMany(ticket); // Crea el ticket en la base de datos
      await cart.save();
    } catch (error) {
      console.log("error en el purcharse dao " + error);
    }
  }
}
