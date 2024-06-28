import { Router } from "express";
import { carts } from '../../controllers/index.js';
import { authorization } from "../../middlewares/authMiddleware.js";
import { passportCall, passportCallOptional } from "../../middlewares/passportMiddleware.js";

const cartRouter = Router();

cartRouter.get("/",passportCall('jwt'),authorization('admin'),carts.getCarts); 
cartRouter.post("/", carts.createCart);
cartRouter.get("/:cid", passportCallOptional('jwt'),carts.getCartById);
cartRouter.post("/:cid/product/:pid", passportCall('jwt'),authorization('user','premium'),carts.addProductFromCart);
cartRouter.delete("/:cid",passportCallOptional('jwt'),authorization('user','premium'),carts.deleteAllProductsFromCartById);
cartRouter.delete("/:cid/product/:pid",passportCallOptional('jwt'),authorization('user','premium'),carts.deleteProductFromCart);
cartRouter.put("/:cid",passportCallOptional('jwt'),authorization('user','premium'),carts.updateCartById);
cartRouter.put("/:cid/product/:pid",passportCallOptional('jwt'),authorization('user','premium'),carts.updateProductCart);
//cartRouter.delete("/all/:cid",carts.deleteCartById)  BORRAR

export default cartRouter;


