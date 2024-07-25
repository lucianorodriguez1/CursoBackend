import {
  cartsRepository,
  productsRepository,
  usersRepository,
  ticketRepository,
} from "../repositories/index.js";

class PurchaseService {
  constructor() {}

  async createPurchase(cid, cCurrent) {
    if (cid != cCurrent) {
      return "Not Authorized";
    }

    const cart = await cartsRepository.getCartById(cid);
    if (!cart) {
      return "Cart not found";
    }

    if (cart.products.length == 0) {
      return "No hay productos en el carrito";
    }

    let totalPrice = 0;
    let prodsNoProcesados = [];
    let isTicket = false;
    let prodsProcesados = [];

    for (const item of cart.products) {
      const productId = item.prodId._id;
      const product = await productsRepository.getProductBy({ _id: productId });
      const quantity = item.quantity;
      let updatedProduct;

      // Verify that the quantity is less than or equal to the stock
      if (product.stock < quantity) {
        prodsNoProcesados.push(productId);
      } else {
        updatedProduct = await productsRepository.updatePurchaseProductById(
          productId,
          quantity
        );
      }

      //Update Product
      if (updatedProduct) {
        totalPrice += product.price * quantity;
        isTicket = true;
        prodsProcesados.push(productId);
        await cartsRepository.deleteProduct(cid, productId, cCurrent);
      }
    }
    const user = await usersRepository.getUserBy({ cartId: cid });
    let ticket;

    if (isTicket) {
      //create ticket
      ticket = {
        amount: totalPrice,
        purchaser: user.email,
        code: uuidv4(),
        purchase_datetime: new Date(),
      };

      await ticketRepository.createTicket(ticket);
    }
    return {
      productosProcesados: prodsProcesados,
      productosNoProcesados: prodsNoProcesados,
    };
  }
}

const purchaseService = new PurchaseService();
export default purchaseService;
