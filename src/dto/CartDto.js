import CustomError from "../services/errors/CustomError.js";
import { ErrorCodes } from "../services/errors/enums.js";
import ProductDTO from "./ProductDto.js";

export default class CartDTO {
  constructor(cart) {
    //this.products = cart.products
  }

  static getCartResponseForRole = (cart, role) => {
    if (role === "admin" || role === "premium" || role === "user") {
      return {
        id: cart._id,
        products:
          cart.products.length > 0
            ? cart.products.map((prod) =>
                ProductDTO.getProductResponseForRole(prod.prodId, role)
              )
            : "No hay productos",
      };
    }
  };
}
