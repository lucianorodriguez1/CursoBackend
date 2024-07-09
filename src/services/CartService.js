import { cartsRepository } from "../repositories/index.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import productsService from "./ProductService.js";
import CartDTO from "../dto/CartDto.js";
import cartModel from "../dao/mongo/models/cartModel.js";

class CartService {
  constructor() { }

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

  async getCartById(id, role, userCartId) {
    console.log(`id: ${id}`);
    console.log(`role: ${role}`)
    console.log(`UserCartId: ${userCartId}`);
    if (id != userCartId && role != 'admin') {
      CustomError.createError({
        name: "no coinciden los parametros",
        cause: "parametros no coinciden",
        message: "Error get cart by id",
        code: ErrorCodes.INVALID_ID,
      });
    }
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

  async addProductFromCart(cid, pid, email, userCartId) {
    if (cid != userCartId) {
      CustomError.createError({
        name: "no coinciden los parametros",
        cause: "parametros no coinciden",
        message: "Error addProductById",
        code: ErrorCodes.INVALID_ID,
      });
    }
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

  async deleteProductsCart(cid, userCartId) {
    if (cid != userCartId) {
      CustomError.createError({
        name: "no coinciden los parametros",
        cause: "parametros no coinciden",
        message: "Error delete products cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
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
  async getProductInCart(cartId, productId) {
    const result = await cartModel.findOne(
      {
        _id: cartId,
        products: { $elemMatch: { prodId: productId } },
      },
      { "products.$": 1 }
    );
    if (!result) {
      CustomError.createError({
        name: "producto no encontrado en cart",
        cause: "invalid product in cart",
        message: "Error get product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    return result;
  }

  async deleteProduct(cid, pid,userCartId) {
    if (cid != userCartId) {
      CustomError.createError({
        name: "no coinciden los parametros",
        cause: "parametros no coinciden",
        message: "Error delete product cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    const cart = await cartsRepository.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error delete product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    await this.getProductInCart(cid, pid);
    await cartsRepository.deleteProduct(cid, pid);
    return "Se elimino el producto del carrito";
  }

  async updateProductsCart(cid, products,userCartId) {
    if (cid != userCartId) {
      CustomError.createError({
        name: "no coinciden los parametros",
        cause: "parametros no coinciden",
        message: "Error delete product cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
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

  async updateProduct(cid, pid, quantity,userCartId) {
    if (cid != userCartId) {
      CustomError.createError({
        name: "no coinciden los parametros",
        cause: "parametros no coinciden",
        message: "Error delete product cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    const cart = await cartsRepository.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error delete product in cart",
        code: ErrorCodes.INVALID_ID,
      });
    }
    await this.getProductInCart(cid, pid);
    await cartsRepository.updateProduct(cid, pid, quantity);
    return "Se actualizo el producto del carrito";
  }
}

const cartService = new CartService();
export default cartService;
