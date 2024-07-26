import { cartsRepository, productsRepository } from "../repositories/index.js";
import CartDTO from "../dao/dto/CartDto.js";

import purchaseService from "../services/PurchaseService.js";



export const getCarts = async (req, res) => {
  const role = req.user.data.role;
  let carts = await cartsRepository.getCarts();
  const result = carts.map((cart) =>
    CartDTO.getCartResponseForRole(cart, role)
  );
  res
    .status(200)
    .json({ succes: true, data: result, message: "You have all the carts" });
};




// You must have permission to see the cart!!!
export const getCartById = async (req, res) => {
  const id = req.params.cid;
  const role = req.user.data.role;
  const userCartId = req.user.data.cartId;

  if (id != userCartId && role != "admin") {
    res.status(403).json({
      succes: false,
      message: "You do not have permission to view the cart",
    });
  }

  let cart = await cartsRepository.getCartById(id);
  if (!cart) {
    res.status(404).json({
      succes: false,
      message: "Cart not found",
    });
  }
  const result = CartDTO.getCartResponseForRole(cart, role);
  res
    .status(200)
    .json({ succes: true, data: result, message: "You have the cart" });
};




export const addProductFromCart = async (req, res) => {

  const idCart = req.params.cid;
  const idProduct = req.params.pid;
  const email = req.user.data.email;

  const cart = await cartsRepository.getCartById(idCart);

  if (!cart) {
    res.status(404).json({
      succes: false,
      message: "Cart not found",
    });
  }

  const product = await productsRepository.getProductBy({_id:pid});

  if (!product) {
    res.status(404).json({
      succes: false,
      message: "Product not found",
    });
  }

  // NO ADD PRODUCT IN CART
  if (product.owner == email) {
    res.status(404).json({
      succes: false,
      message: "You cannot add your own products to your cart",
    });
  }

  //SUCCESS
  const result = await cartsRepository.addProductFromCart(cid, pid);
  res.status(200).json({ success: true, data: result });
};


export const deleteAllProductsFromCartById = async (req, res) => {

  const cid = req.params.cid;
  const cart = await cartsRepository.getCartById(cid);

  if (!cart) {
    res.status(404).json({
      succes: false,
      message: "Cart not found",
    });
  }

  const result = await cartsRepository.deleteProductsCart(cid);
  res.status(200).json({ success: true, data: result });


};





export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  const userCartId = req.user.data.cartId;

  const cart = await cartsRepository.getCartById(cid);

  if (!cart) {
    res.status(404).json({
      succes: false,
      message: "Cart not found",
    });
  }

  const product = await productsRepository.getProductBy({_id:pid});

  if (!product) {
    res.status(404).json({
      succes: false,
      message: "Product not found",
    });
  }


  const result = await cartsRepository.deleteProduct(cid, pid);
  res.status(200).json({success:true,data:result});


};








export const updateCartById = async (req, res) => {
  const { products } = req.body;


  const { cid } = req.params;
  const cart = await cartsRepository.getCartById(cid);

  if (!cart) {
    res.status(404).json({
      succes: false,
      message: "Cart not found",
    });
  }

  const result = await cartsRepository.updateProductsCart(cid, products);
  res.status(200).json({success:true,data:result});
};



export const updateProductCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;


  const cart = await cartsRepository.getCartById(cid);

  if (!cart) {
    res.status(404).json({
      succes: false,
      message: "Cart not found",
    });
  }


  const result = await cartsRepository.updateProduct(cid, pid, quantity);
  res.status(200).json({success:true,data:result});

};




export const createPurchase = async (req, res) => {
  const cartId = req.params.cid;
  const cartCurrent = req.user.data.cartId;
  const result = await purchaseService.createPurchase(cartId, cartCurrent);
  res.status(200).json({success:true,data:result});
};
