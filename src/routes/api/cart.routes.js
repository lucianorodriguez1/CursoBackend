import { Router } from "express";
import { carts } from '../../controllers/index.js';
import { authorization } from "../../middlewares/authMiddleware.js";
import { passportCall} from "../../middlewares/passportMiddleware.js";

const cartRouter = Router();

cartRouter.get("/",passportCall('jwt'),authorization('admin'),carts.getCarts); 
cartRouter.get("/:cid", passportCall('jwt'),authorization('user','premium','admin'),carts.getCartById);// mal
cartRouter.post("/:cid/product/:pid", passportCall('jwt'),authorization('user','premium'),carts.addProductFromCart);//mal
cartRouter.delete("/:cid/product/:pid",passportCall('jwt'),authorization('user','premium'),carts.deleteProductFromCart);//mal
cartRouter.put("/:cid",passportCall('jwt'),authorization('user','premium'),carts.updateCartById);//mal
cartRouter.put("/:cid/product/:pid",passportCall('jwt'),authorization('user','premium'),carts.updateProductCart);//mal


export default cartRouter;


