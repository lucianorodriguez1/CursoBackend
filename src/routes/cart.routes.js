import { Router } from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

const cartRouter = Router();
const cartManager = new CartManager("./carts.json");
const productManager = new ProductManager("./products.json");

cartRouter.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();

    res.send({ carts });
  } catch (error) {
    console.log(EvalError);
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    if (Array.isArray(products)) {
      const cart = await cartManager.addCart({ products });
    } else {
      console.log("Productos no es array");
      res
        .status(400)
        .send({ status: 400, message: "Productos no es un array" });
    }
    res.send({ status: 200, message: "Carrito agregado desde routes" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: 500, message: "Error interno del servidor" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const idCart = req.params.cid;

    const carts = await cartManager.getCarts();

    const cart = carts.find((cart) => cart.id == idCart);

    if (!cart) {
      console.log("Cart no encontrado");
      res.send({ status: 404, message: "Cart no encontrado" });
    } else {
      const products = cart.products;
      res.send({ status: 200, message: products });
    }
  } catch (error) {
    console.log(error);
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;

    const { quantity } = req.body;

    const product = await productManager.getProductById(idProduct);

    if(!product)res.send({status:404, message:"Product not found"});
    console.log(quantity);

    res.send({status:200,message:"Producto agregado servidor"})
    await cartManager.addProductsToCart(idCart,{idProduct,quantity});
  } catch (error) {
    console.log(error);
  }
});

export default cartRouter;
