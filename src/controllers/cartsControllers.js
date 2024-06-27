import cartService from "../services/CartService.js";
import { response } from "../utils/response.js";

export const getCarts = async (req, res) => {
  const role = req.user?.user?.role || null;
  const data = await cartService.getCarts(role);
  response(res, 200, data);
};
export const createCart = async (req, res) => {
  const data = await cartService.createCart();
  response(res, 201, data);
};
export const getCartById = async (req, res) => {
  const id = req.params.cid;
  const data = await cartService.getCartById(id);
  response(res, 200, data);
};
export const addProductFromCart = async (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;
  const data = await cartService.addProductFromCart(idCart, idProduct,req.user.user.email);
  response(res, 200, data);
};
export const deleteAllProductsFromCartById = async (req, res) => {
  const { cid } = req.params;
  const data = await cartService.deleteProductsCart(cid);
  response(res, 200, data);
};
export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  const data = cartService.deleteProduct(cid, pid);
  response(res, 200, data);
};
export const updateCartById = async (req, res) => {
  const { products } = req.body;
  const { cid } = req.params;
  const data = await cartService.updateProductsCart(cid, products);
  response(res, 200, data);
};
export const updateProductCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const data = await cartService.updateProduct(cid, pid, quantity);
  response(res, 200, data);
};

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const data = await cartService.purchaseCart(cid);
  response(res, 200, data);
};

export const deleteCartById = async (req, res) => {
  const { cid } = req.params;
  const data = await cartService.deleteCartById(cid);
  response(res, 200, 'delete cart');
};
