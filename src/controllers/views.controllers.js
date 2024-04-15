import { productManager } from "../models/product.model.js";
import { messageManager } from "../models/message.model.js";
import { cartManager } from "../models/cart.model.js";

export const viewHome = async (req, res) => {
  try {

    res.render("index");  
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
    let { limit, page, sort, query } = req.query;
    
    limit = !limit ? 2:limit;
    const response = await productManager.getProducts(limit,page,sort,query)

    const existsNextPage = response.hasNextPage;
    const existsPrevPage = response.hasPrevPage;
    const nextLink=`http://localhost:8080/products?page=${(response.page+1)}&limit=2`;
    const prevLink=`http://localhost:8080/products?page=${response.page-1}&limit=2`;
    const dataMongoose = response.payload;
    const products = dataMongoose.map(doc=>doc.toObject());
    res.render("../views/products", {
      products,
      existsNextPage,
      existsPrevPage,
      nextLink,
      prevLink
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
export const viewProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getElementByIdLean(pid);
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

//PRUEBAS****
export const viewRegister = async (req, res) => {
  try {
    res.render("register", {
    }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

export const viewLogin = async (req, res) => {
  try {
    res.render("login", {
    }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};