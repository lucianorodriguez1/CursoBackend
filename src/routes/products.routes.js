import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productRouter = Router();
const productManager = new ProductManager("./products.json");

productRouter.get("/", async (req, res) => {
  let products = await productManager.getProducts();
  let limit = req.query.limit;

  if (!limit) return res.send({ products });

  let productsLimits = products.slice(0, limit);
  res.send({ productsLimits });
});

productRouter.get("/:pid", async (req, res) => {
  let products = await productManager.getProducts();
  let idProduct = req.params.pid;

  let product = products.find((product) => product.id == idProduct);

  if (!product) return res.send("Product not found");

  res.send({ product });
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
      thumbnail.length === 0
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
      await productManager.addProduct(product);
      console.log("Producto agregado correctamente.");
      res.send({ status: 200, message: "Producto creado con exito" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: 500, message: "Error interno del servidor" });
  }
});

productRouter.put("/:pid", async (req, res) => {
  try {
    let products = await productManager.getProducts();
    let idProduct = req.params.pid;

    let product = products.find((product) => product.id == idProduct);

    if (!product) return res.send("Product not found");

    // const index = products.findIndex((product) => product.id == id);
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

    await productManager.updateProduct(idProduct, {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnail,
    });
    console.log({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnail,
    });
    res.send({status:200,message:"El producto se actualizo correctamente"});
  } catch (error) {
    console.log(error);
  }
});

productRouter.delete("/:pid", async (req, res) => {
  try {
    let idProduct = req.params.pid;
    await productManager.deleteProduct(idProduct);
    res.send({ status: 200, message: `Producto with id ${idProduct} deleted` });
  } catch (error) {
    console.log(error.message);
  }
});

export default productRouter;
