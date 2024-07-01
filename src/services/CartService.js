import { cartsRepository } from "../repositories/index.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import productsService from "./ProductService.js";
import CartDTO from "../dto/CartDto.js";

class CartService {
  constructor() {}

  async getCarts(role) {
    let carts = await cartsRepository.getCarts();
    const result = carts.map((cart) =>
      CartDTO.getCartResponseForRole(cart, role)
    );
    return result;
  }

  async createCart() {
    let result = await cartsRepository.createCart();
    return result;
  }

  async getCartById(id, role) {
    let cart = await cartsRepository.getCartById(id);
    if (!cart)
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error get cart",
        code: ErrorCodes.INVALID_ID,
      });   
    const result = CartDTO.getCartResponseForRole(cart, role);
    return result;
  }

  async addProductFromCart(cid, pid, email) {
    const cart = await cartsRepository.getCartById(cid);
    if (!cart)
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error get cart",
        code: ErrorCodes.INVALID_ID,
      });
  
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
      return "Se agrego el producto al carrito";
    }
  }

  async deleteProductsCart(cid) {
    const cart = await cartsRepository.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error delete product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    await cartsRepository.deleteProductsCart(cid);
    return "Se eliminaron todos los productos del carrito";
  }

  async deleteProduct(cid, pid) {
    const cart = await cartsRepository.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error delete product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    await productsService.getProductById(pid);
    await cartsRepository.deleteProduct(cid, pid);
    return "Se elimino el producto del carrito";
  }

  async updateProductsCart(cid, products) {
    const cart = await cartsRepository.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error add product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    await cartsRepository.updateProductsCart(cid, products);
    return "Se actualizo el carrito";
  }

  async updateProduct(cid, pid, quantity) {
    const cart = await cartsRepository.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error delete product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    await productsService.getProductById(pid);
    await cartsRepository.updateProduct(cid, pid, quantity);
    return "Se actualizo el producto del carrito";
  }
}

const cartService = new CartService();
export default cartService;
