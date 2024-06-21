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
    return result;
  }
  async addProductFromCart(cid, pid) {
    let result = await cartsRepository.addProductFromCart(cid,pid);
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
