import { Router } from "express";
import { getCarts,createCart,getCartById,addProductFromCart, deleteAllProductsFromCartById,deleteProductFromCart,updateCartById,updateProductCart } from "../controllers/carts.controllers.js";

const cartRouter = Router();

cartRouter.get("/", getCarts); 
cartRouter.post("/", createCart);
cartRouter.get("/:cid", getCartById);
cartRouter.post("/:cid/product/:pid", addProductFromCart);
cartRouter.delete("/:cid",deleteAllProductsFromCartById);
cartRouter.delete("/:cid/product/:pid",deleteProductFromCart);
cartRouter.put("/:cid",updateCartById);
cartRouter.put("/:cid/product/:pid",updateProductCart);
//PRUEBAS **************
/*
//getProductCart
cartRouter.get("/:cid/product/:pid", getProductCart);
*/
export default cartRouter;
