import { productManager } from "../models/product.model.js";

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

export const viewRealTimeProducts = async (req, res) => {
  res.render("../views/realTimeProducts", {
    //products:(await productManager.getProducts()),
  });
};
