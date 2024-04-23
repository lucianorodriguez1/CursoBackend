import { productManager } from "../dao/MongoDB/managers/product.dao.js";
import { messageManager } from "../dao/MongoDB/managers/message.dao.js";
import { cartManager } from "../dao/MongoDB/managers/cart.dao.js";

export const viewHome = async (req, res) => {
  try {
    res.render("index",{
    isLogin : req.session.isLogin
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
    let { limit, page, sort, query } = req.query;

    let usernameUser;
    let admin;
    if (req.session.admin) {
      admin = true;
    }
    if (req.session.user) {
      usernameUser = req.session.user.first_name;
    } else {
      usernameUser = "anonimo";
    }
    const response = await productManager.getProducts(limit, page, sort, query);
    const existsNextPage = response.hasNextPage;
    const existsPrevPage = response.hasPrevPage;
    const nextLink = `http://localhost:8080/products?page=${
      response.page + 1
    }&limit=2`;
    const prevLink = `http://localhost:8080/products?page=${
      response.page - 1
    }&limit=2`;
    const dataMongoose = response.payload;
    const products = dataMongoose.map((doc) => doc.toObject());
    res.render("../views/products", {
      products,
      existsNextPage,
      existsPrevPage,
      nextLink,
      prevLink,
      usernameUser,
      admin,
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
export const viewRegister = async (req, res) => {
  try {
    res.render("register", {});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
export const viewLogin = async (req, res) => {
  try {
    res.render("login", {});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
export const viewProfile = async (req, res) => {
  try {
    const userData = req.session.user;
    res.render("profile", {
      userFirstName: userData.first_name,
      userLastName: userData.last_name,
      userAge: userData.age,
      userEmail: userData.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error en el servidor" });
  }
};
