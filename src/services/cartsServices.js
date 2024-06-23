import { cartsRepository } from "../repositories/index.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import productsService from "./productsServices.js";
import productModel from "../dao/mongo/models/product.model.js";
import ticketModel from "../dao/mongo/models/ticket.model.js";
import userModel from "../dao/mongo/models/user.model.js";
import { v4 as uuidv4 } from "uuid";

class CartService {
  constructor() {}

  async getCarts() {
    let result = await cartsRepository.getCarts();
    return result;
  }

  async createCart() {
    let result = await cartsRepository.createCart();
    return result;
  }

  async getCartById(id) {
    let result = await cartsRepository.getCartById(id);
    if (!result)
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error get cart",
        code: ErrorCodes.INVALID_ID,
      });
    return result;
  }

  async addProductFromCart(cid, pid, email) {
    const cart = await this.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error add product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    const product = await productsService.getProductById(pid);
    if (product.owner == email) {
      CustomError.createError({
        name: "no se puede agregar su propio prod al carrito",
        cause: "invalid add product cart",
        message: "Error add product in cart",
        code: ErrorCodes.NOT_AVAILABLE_ADDPRODUCTCART,
      });
    } else {
      await cartsRepository.addProductFromCart(cid, pid);
      return "Se agrego el producto al cart";
    }
  }

  async deleteProductsCart(cid) {
    const cart = await this.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error delete product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    let result = await cartsRepository.deleteProductsCart(cid);
    return "Se eliminaron todos los productos del carrito";
  }

  async deleteProduct(cid, pid) {
    const cart = await this.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error delete product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    await productsService.getProductById(pid);
    let result = await cartsRepository.deleteProduct(cid, pid);
    return result;
  }

  async updateProductsCart(cid, products) {
    const cart = await this.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error add product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    let result = await cartsRepository.updateProductsCart(cid, products);
    return result;
  }

  async updateProduct(cid, pid, quantity) {
    const cart = await this.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error delete product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    await productsService.getProductById(pid);
    let result = await cartsRepository.updateProduct(cid, pid, quantity);
    return result;
  }

  async purchaseCart(cid) {
    const cart = await this.getCartById(cid);
    let totalPrice;
    let prodsNoProcesados = [];
    let isTicket = false;
    let prodsProcesados = [];

    for (const item of cart.products) {
      const productId = item.prodId._id;
      const product = await productsService.getProductById(item.prodId);
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
        await cartsService.deleteProduct(cid, productId);
      }
    }
    //HACER UNA FUNCION EN SERVICIOS DE USUARIO QUE BUSQUE POR CART
    const user = await userModel.findOne({ cartId: cid });
    let ticket;

    // HACER UNA FUNCION CREAR TICKET
    if (isTicket) {
      ticket = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: totalPrice,
        purchaser: user.email,
      };
      await ticketModel.insertMany(ticket);
    }

    //ESTO HACE FALTA?
    await cart.save();
    return {
      productosProcesados: prodsProcesados,
      productosNoProcesados: prodsNoProcesados,
    };
  }

  async deleteCartById(cid) {
    await this.getCartById(cid);
    let result = await cartsRepository.deleteCartById(cid);
    return result;
  }
}

const cartsService = new CartService();
export default cartsService;
