import productsService from "./ProductService.js";
import cartService from "./CartService.js";
import ticketService from "./TicketService.js";
import userService from "./UserService.js";
import { cartsRepository } from "../repositories/index.js";
import CustomError from "../utils/errors/CustomError.js";
import { ErrorCodes } from "../utils/errors/enums.js";

class PurchaseService {
  constructor() {}

  async createPurchase(cid,cCurrent) {
    if(cid != cCurrent)CustomError.createError({
      name: "sin permisos para la compra",
      cause: "invalid parametros de purchase",
      message: "Error create purhcase",
      code: ErrorCodes.INVALID_ID,
    })
    const cart = await cartsRepository.getCartById(cid);
    if (!cart)
      CustomError.createError({
        name: "cart no encontrado",
        cause: "invalid id",
        message: "Error get cart en create purchase",
        code: ErrorCodes.INVALID_ID,
      });
    if(cart.products.length == 0){
      return 'No hay productos en el carrito'
    }
    let totalPrice = 0;
    let prodsNoProcesados = [];
    let isTicket = false;
    let prodsProcesados = [];

    for (const item of cart.products) {
      const productId = item.prodId._id;
      const product = await productsService.getProductById(productId);
      const quantity = item.quantity;
      let updatedProduct;

      if (product.stock < quantity) {
        prodsNoProcesados.push(productId);
      } else {
        updatedProduct = await productsService.upddatePurchaseProductById(
          productId,
          quantity
        );
      }

      if (updatedProduct) {
        totalPrice += product.price * quantity;
        isTicket = true;
        prodsProcesados.push(productId);
        await cartService.deleteProduct(cid, productId,cCurrent);
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
    return {
      productosProcesados: prodsProcesados,
      productosNoProcesados: prodsNoProcesados,
    };
  }
}

const purchaseService = new PurchaseService();
export default purchaseService;
