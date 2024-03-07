import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productRouter = Router();
const productManager = new ProductManager("./products.json");

productRouter.get("/", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    let limit = req.query.limit;

    if (!limit) return res.json(products);

    let productsLimits = products.slice(0, limit);
    res.json(productsLimits);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    if (
      typeof title === "string" &&
      typeof description === "string" &&
      typeof code === "number" &&
      typeof price === "number" &&
      typeof status === "boolean" &&
      typeof stock === "number" &&
      typeof category === "string" &&
      Array.isArray(thumbnail) &&
      thumbnail.length === 0 &&
      title &&
      description &&
      code &&
      price &&
      status &&
      stock &&
      category &&
      thumbnail
    ) {
      const product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      };
      const existingCode = (await productManager.getProducts()).some(
        (p) => p.code == product.code
      );
      if (existingCode) {
        res.status(400).json({ message: "Campos incompletos o invalidos" });
      } else {
        const response = await productManager.addProduct(product);
        res
          .status(201)
          .json({ message: "Producto agregado correctamente", response });
      }
    } else {
      res.status(400).json({ message: "Campos incompletos o invalidos" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const response = await productManager.getProductById(id);
    if (!response)
      return res.status(404).json({ message: "Product not found" });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
});

productRouter.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;

    const response = await productManager.updateProduct(id, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });

    if (response == -1) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Successfully updated product" });
    }
  } catch (error) {
    console.log(error);
  }
});

productRouter.delete("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    const response = await productManager.deleteProduct(id);
    if (response == -1) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Successfully deleted product" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default productRouter;
