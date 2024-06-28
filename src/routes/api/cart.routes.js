import { Router } from "express";
import { carts } from '../../controllers/index.js';
import { authorization } from "../../middlewares/authMiddleware.js";
import { passportCall, passportCallOptional } from "../../middlewares/passportMiddleware.js";

const cartRouter = Router();

cartRouter.get("/", passportCallOptional('jwt'),carts.getCarts); 
cartRouter.post("/", carts.createCart);
cartRouter.get("/:cid", carts.getCartById);
cartRouter.post("/:cid/product/:pid", passportCall('jwt'),authorization('user','premium'),carts.addProductFromCart);
cartRouter.delete("/:cid",carts.deleteAllProductsFromCartById);
cartRouter.delete("/:cid/product/:pid",carts.deleteProductFromCart);
cartRouter.put("/:cid",carts.updateCartById);
cartRouter.put("/:cid/product/:pid",carts.updateProductCart);
cartRouter.delete("/all/:cid",carts.deleteCartById)

export default cartRouter;


