import { cartsRepository } from "../repositories/index.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import { generateProductErrorInfo } from "./errors/info.js";
import productsService from "./productsServices.js";

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

  async addProductFromCart(cid, pid) {
    const cart = await this.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error add product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    await productsService.getProductById(pid);
    await cartsRepository.addProductFromCart(cid, pid);
    return "Se agrego el producto al cart";
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
    return  "Se eliminaron todos los productos del carrito";
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
    let result = await cartsRepository.purchaseCart(cid);
    return result;
  }
}

const cartsService = new CartService();
export default cartsService;
