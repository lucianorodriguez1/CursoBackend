import {cartsRepository } from "../repositories/index.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import { generateProductErrorInfo } from "./errors/info.js";

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
    if(!cart){
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error add product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    let result = await cartsRepository.addProductFromCart(cid,pid);
    if (!result)
      CustomError.createError({
        name: "producto no encontrado",
        cause: "invalid id",
        message: "Error add product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    return result;
  }

  async updateProductsCart(cid, products) {
    let result = await cartsRepository.updateProductsCart(cid,products);
    return result;
  }
  async updateProduct(cid, pid,quantity) {
    let result = await cartsRepository.updateProduct(cid,pid,quantity);
    return result;
  }
  async deleteProductsCart(cid) {
    let result = await cartsRepository.deleteProductsCart(cid);
    return result;
  }
  async deleteProduct(cid,pid) {
    let result = await cartsRepository.deleteProduct(cid,pid);
    return result;
  }
  async purchaseCart(cid){
    let result = await cartsRepository.purchaseCart(cid);
    return result;
  }
}

const cartsService = new CartService();
export default cartsService;
