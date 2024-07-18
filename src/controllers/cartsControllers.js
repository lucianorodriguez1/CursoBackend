import cartService from "../services/CartService.js";
import purchaseService from "../services/PurchaseService.js";
import { response } from "../utils/response.js";

export const getCarts = async (req, res) => {
  const role = req.user?.data?.role || null;
  const data = await cartService.getCarts(role);
  response(res, 200, data);
};
export const getCartById = async (req, res) => {
  const id = req.params.cid;
  const role = req.user?.data?.role;
  const userCartId = req.user?.data?.cartId || null;
  const data = await cartService.getCartById(id,role,userCartId);
  response(res, 200, data);
};
export const addProductFromCart = async (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;
  const email = req.user?.data?.email || null;
  const userCartId = req.user?.data?.cartId || null;
  const data = await cartService.addProductFromCart(
    idCart,
    idProduct,
    email,
    userCartId
  );
  response(res, 200, data);
};
export const deleteAllProductsFromCartById = async (req, res) => {
  const { cid } = req.params;
  const userCartId = req.user?.data?.cartId || null;
  const data = await cartService.deleteProductsCart(cid,userCartId);
  response(res, 200, data);
};
export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  const userCartId = req.user?.data?.cartId || null;
  const data = await cartService.deleteProduct(cid, pid,userCartId);
  response(res, 200, data);
};
export const updateCartById = async (req, res) => {
  const { products } = req.body;
  const { cid } = req.params;
  const userCartId = req.user?.data?.cartId || null;
  const data = await cartService.updateProductsCart(cid, products,userCartId);
  response(res, 200, data);
};
export const updateProductCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const userCartId = req.user?.data?.cartId || null;
  const data = await cartService.updateProduct(cid, pid, quantity,userCartId);
  response(res, 200, data);
};

export const createPurchase = async(req,res) => {
  const cartId = req.params.cid
  const cartCurrent = req.user?.data?.cartId || null;
  const result = await purchaseService.createPurchase(cartId,cartCurrent);
  response(res, 200, result);
}