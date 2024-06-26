import cartService from "../services/CartService.js";
import { response } from "../utils/response.js";

export const getCarts = async (req, res) => {
  const role = req.user?.data?.role || null;
  const data = await cartService.getCarts(role);
  response(res, 200, data);
};
export const getCartById = async (req, res) => {
  const id = req.params.cid;
  const data = await cartService.getCartById(id,req.user.data.role);
  response(res, 200, data);
};
export const addProductFromCart = async (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;
  const data = await cartService.addProductFromCart(
    idCart,
    idProduct,
    req.user.data.email
  );
  response(res, 200, data);
};
export const deleteAllProductsFromCartById = async (req, res) => {
  const { cid } = req.params;
  const data = await cartService.deleteProductsCart(cid);
  response(res, 200, data);
};
export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  const data = await cartService.deleteProduct(cid, pid);
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
