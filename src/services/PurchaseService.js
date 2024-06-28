import productsService from "./ProductService.js";
import cartService from "./CartService.js";
import ticketService from "./TicketService.js";
import userService from "./UserService.js";
import productService from "./ProductService.js";

class PurchaseService {
  constructor() {}

  async createPurchase(cid) {
    const cart = await cartService.getCartById(cid);
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
        updatedProduct = await productService.upddatePurchaseProductById(productId);
      }

      if (updatedProduct) {
        totalPrice = updatedProduct.price * quantity;
        isTicket = true;
        prodsProcesados.push(productId);
        await cartService.deleteProduct(cid, productId);
      }
    }
    const user = await userService.getUserByCart(cid);
    let ticket;

    if (isTicket) {
      ticket = {
        amount: totalPrice,
        purchaser: user.email,
      };
      await ticketService.createTicket(ticket);
    }
    await cart.save();
    return {
      productosProcesados: prodsProcesados,
      productosNoProcesados: prodsNoProcesados,
    };
  }
}

const purchaseService = new PurchaseService();
export default purchaseService;
