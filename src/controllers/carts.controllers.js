import CartManager from "../models/CartManager.js";

const cartManager = new CartManager("./carts.json");

export const getCarts = async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.send(carts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

export const createCart = async (req, res) => {
  try {
    const response = await cartManager.createCart();

    res.status(201).json({ message: "Created cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

export const getCartById = async (req, res) => {
  try {
    const id = req.params.cid;
    const response = await cartManager.getCartById(id);
    if (!response) return res.status(404).json({ message: "Cart not found" });
    res.json(response);
  } catch (error) {
    console.log("Error during cart creation: ", error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;

    const response = await cartManager.addProductToCart(idCart, idProduct);
    if (!response) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      res.status(201).json({ message: "Producto agregado al carrito" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
