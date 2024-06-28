import productsService from "./ProductService.js";
import cartService from "./CartService.js";
import productModel from "../dao/mongo/models/productModel.js";
import userModel from "../dao/mongo/models/userModel.js";
import ticketService from "./TicketService.js";

class PurchaseService {
    constructor() {
    }

    async generatePurchase(cid) {
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

            //hacer funcion de findOneUpdate
            if (product.stock < quantity) {
                prodsNoProcesados.push(productId);
            } else {
                updatedProduct = await productModel.findOneAndUpdate(
                    { _id: productId, stock: { $gte: quantity } },
                    { $inc: { stock: -quantity } },
                    { new: true }
                );
            }

            if (updatedProduct) {
                totalPrice = updatedProduct.price * quantity;
                isTicket = true;
                prodsProcesados.push(productId);
                await cartService.deleteProduct(cid, productId);
            }
        }
        //HACER UNA FUNCION EN SERVICIOS DE USUARIO QUE BUSQUE POR CART
        const user = await userModel.findOne({ cartId: cid });
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