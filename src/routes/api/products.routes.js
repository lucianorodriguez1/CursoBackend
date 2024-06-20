import { Router } from "express";
/*
import {
  getProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../controllers/products.controllers.js";
*/
import { products } from '../../controllers/index.js';
import { authorization } from "../../middlewares/auth.middleware.js";
import { passportCall } from "../../middlewares/passport.middleware.js";
import {validateCreate} from "../../validator/product.js"

const productRouter = Router();

productRouter.get("/", products.getProducts);
productRouter.post("/", passportCall('jwt'),authorization("admin"), validateCreate,products.createProduct);
productRouter.get("/:pid", products.getProductById);
productRouter.put("/:pid",  passportCall('jwt'),authorization("admin"),products.updateProductById);
productRouter.delete("/:pid",  passportCall('jwt'),authorization("admin"), products.deleteProductById);

export default productRouter;
