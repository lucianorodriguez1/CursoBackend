import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../controllers/products.controllers.js";
import { authorization } from "../middlewares/auth.middleware.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import {validateCreate} from "../validator/product.js"

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.post("/", passportCall('jwt'),authorization("admin"), validateCreate,createProduct);
productRouter.get("/:pid", getProductById);
productRouter.put("/:pid",  passportCall('jwt'),authorization("admin"), updateProductById);
productRouter.delete("/:pid",  passportCall('jwt'),authorization("admin"), deleteProductById);

export default productRouter;
