import { Router } from "express";
import { getProducts,createProduct,getProductById,updateProductById,deleteProductById } from "../controllers/products.controllers.js";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.post("/", createProduct);
productRouter.get("/:pid", getProductById);
productRouter.put("/:pid", updateProductById);
productRouter.delete("/:pid", deleteProductById);

export default productRouter; 
