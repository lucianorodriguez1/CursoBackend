import { productManager } from "../models/product.model.js";
import { messageManager } from "../models/message.model.js";
import { cartManager } from "../models/cart.model.js";

export const viewHome = async (req, res) => {
  try {
    const products = await productManager.getElements();

    res.render("index", {
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
export const viewChat = async (req, res) => {
  try {
    const messages = await messageManager.getElements();
    res.render("../views/chat", {
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
export const viewProducts = async (req, res) => {
  try {
    let { limit, page, sort, category, stock } = req.query;
    const response = await productManager.getProducts(
      limit,
      page,
      sort,
      category,
      stock
    );
    const dataMongoose = response.payload;
    const products = dataMongoose.map(doc=>doc.toObject());
    res.render("../views/products", {
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
export const viewProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getElementById(pid);
    res.render("../views/product", {
      productId: pid,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
export const viewCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cartData = await cartManager.getCartPopulate(cid);
    res.render("../views/cart", {
      cartId: cid,
      cart: cartData.products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
 