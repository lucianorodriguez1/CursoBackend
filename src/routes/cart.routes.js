import { Router } from "express";
import { getCarts,createCart,getCartById,addProductToCart} from "../controllers/carts.controllers.js";
const cartRouter = Router();

cartRouter.get("/", getCarts);

cartRouter.post("/", createCart);

cartRouter.get("/:cid", getCartById);

cartRouter.post("/:cid/product/:pid", addProductToCart);

export default cartRouter;
