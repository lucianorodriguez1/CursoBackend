import { Router } from "express";
import { getCarts,createCart,getCartById,addProductFromCart, deleteAllProductsFromCartById,deleteProductFromCart,updateCartById } from "../controllers/carts.controllers.js";
// ,updateProductFromCart,getProductFromCart
const cartRouter = Router();

cartRouter.get("/", getCarts); 
cartRouter.post("/", createCart);
cartRouter.get("/:cid", getCartById);
cartRouter.post("/:cid/product/:pid", addProductFromCart);
cartRouter.delete("/:cid",deleteAllProductsFromCartById);
cartRouter.delete("/:cid/product/:pid",deleteProductFromCart);
//PRUEBAS **************
cartRouter.put("/:cid",updateCartById);
/*
cartRouter.put("/:cid/product/:pid",updateProductFromCart);
cartRouter.get("/:cid/product/:pid", getProductFromCart);
*/
export default cartRouter;
