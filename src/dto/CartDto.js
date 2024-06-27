import CustomError from "../services/errors/CustomError.js";
import { ErrorCodes } from "../services/errors/enums.js";
import ProductDTO from "./ProductDto.js";

export default class CartDTO {
  constructor(cart) {
    //this.products = cart.products
  }

  static getCartResponseForRole = (cart, role) => {
    if (role === "admin" || role === "premium") {
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

    if (role === "premium") {
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

    CustomError.createError({
      name: "no hay permiso para ver el cart",
      cause: "no permisos para cart",
      message: "Error dto cart",
      code: ErrorCodes.NOT_PERMISSION_GET_CART,
    });
  };
}
/*
    Modificar el dto de cart:
    *     devolver todos los carritos completos sin __v al admin. sin permisos a otro rol
    *     solamente devolver el carrito al usuario logueado con sus producto. sacar el __v y el id
    * 
    */
