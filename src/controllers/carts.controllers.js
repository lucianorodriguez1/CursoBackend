import cartsService from "../services/cartsServices.js";
import { response } from "../utils/response.js";

export const getCarts = async (req, res) => {
    const data = await cartsService.getCarts();
    response(res,200,data);
};
export const createCart = async (req, res) => {
    const data = await cartsService.createCart();
    response(res,201,data);
};
export const getCartById = async (req, res) => {
    const id = req.params.cid;
    const data = await cartsService.getCartById(id);
    response(res,200,data);
};
export const addProductFromCart = async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const data = await cartsService.addProductFromCart(idCart, idProduct);
    response(res,200,data);
};
export const deleteAllProductsFromCartById = async (req, res) => {
    const { cid } = req.params;
    const data = await cartsService.deleteProductsCart(cid);
   response(res,200,data)
};
export const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    const data = cartsService.deleteProduct(cid, pid);
    response(res,200,data);
};
export const updateCartById = async (req, res) => {
    const { products } = req.body;
    const { cid } = req.params;
    const data = await cartsService.updateProductsCart(cid, products);
    response(res,200,data)
};
export const updateProductCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const data = await cartsService.updateProduct(cid, pid, quantity);
    response(res,200,data)
};

export const purchase = async(req,res) =>{
    const { cid} = req.params;
    const data = await cartsService.purchaseCart(cid);
    response(res,200,data)
}

