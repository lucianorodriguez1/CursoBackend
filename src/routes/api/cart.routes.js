import { Router } from "express";
import { carts } from '../../controllers/index.js';
import { authorization } from "../../middlewares/authMiddleware.js";
import { passportCall} from "../../middlewares/passportMiddleware.js";

const cartRouter = Router();

cartRouter.get("/",passportCall('jwt'),authorization('admin'),carts.getCarts); 
cartRouter.get("/:cid", passportCall('jwt'),authorization('user','premium','admin'),carts.getCartById);
cartRouter.post("/:cid/product/:pid", passportCall('jwt'),authorization('user','premium'),carts.addProductFromCart);
cartRouter.delete("/:cid/product/:pid",passportCall('jwt'),authorization('user','premium'),carts.deleteProductFromCart);
cartRouter.put("/:cid",passportCall('jwt'),authorization('user','premium'),carts.updateCartById);
cartRouter.put("/:cid/product/:pid",passportCall('jwt'),authorization('user','premium'),carts.updateProductCart);


export default cartRouter;


