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
            ? cart.products.map((prod) =>({
              product:ProductDTO.getProductResponseForRole(prod.prodId, role),
              quantity: prod.quantity,
            })
              )
            : "No hay productos",
      };
    }
  };
}
