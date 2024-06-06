import { Router } from "express";
import { getCarts,createCart,getCartById,addProductFromCart, deleteAllProductsFromCartById,deleteProductFromCart,updateCartById,updateProductCart } from "../controllers/carts.controllers.js";
import { authorization } from "../middlewares/auth.middleware.js";
import { passportCall } from "../middlewares/passport.middleware.js";

const cartRouter = Router();

cartRouter.get("/", getCarts); 
cartRouter.post("/", createCart);
cartRouter.get("/:cid", getCartById);
cartRouter.post("/:cid/product/:pid", passportCall('jwt'),authorization("user"),addProductFromCart);
cartRouter.delete("/:cid",deleteAllProductsFromCartById);
cartRouter.delete("/:cid/product/:pid",deleteProductFromCart);
cartRouter.put("/:cid",updateCartById);
cartRouter.put("/:cid/product/:pid",updateProductCart);

export default cartRouter;


