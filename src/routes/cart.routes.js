import { Router } from "express";
import CartManager from "../CartManager.js";

const cartRouter = Router();
const cartManager = new CartManager("./carts.json");

cartRouter.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();

    res.send({ carts });
  } catch (error) {
    console.log(error);
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const response = await cartManager.CreateCart();

    res.status(201).json({ message: "Created cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    const response = await cartManager.getCartById(id);
    if (!response) return res.status(404).json({ message: "Cart not found" });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;

    const response = await cartManager.addProductsToCart(idCart, idProduct);
    if (!response) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      res.json({ message: "Producto agregado correctamente" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default cartRouter;
