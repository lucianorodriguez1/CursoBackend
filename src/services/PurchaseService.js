import productsService from "./ProductService.js";
import cartService from "./CartService.js";
import productModel from "../dao/mongo/models/productModel.js";
import ticketModel from "../dao/mongo/models/ticketModel.js";
import userModel from "../dao/mongo/models/userModel.js";
import { v4 as uuidv4 } from "uuid";

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

        // HACER UNA FUNCION CREAR TICKET
        if (isTicket) {
            ticket = {
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: totalPrice,
                purchaser: user.email,
            };
            await ticketModel.insertMany(ticket);
        }

        //ESTO HACE FALTA?
        await cart.save();
        return {
            productosProcesados: prodsProcesados,
            productosNoProcesados: prodsNoProcesados,
        };


    }

}

const purchaseService = new PurchaseService();
export default purchaseService;