import Cart from "../dao/mongo/cart.dao.js";
import Product from "../dao/mongo/product.dao.js";
import { productsRepository,cartsRepository } from "../repositories/index.js";


export const viewHome = async (req, res) => {
  res.render("index", {
    isLogin: req.user,
  });
};
export const viewProducts = async (req, res) => {
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
  const response = await productsRepository.getProducts(limit, page, sort, query);
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
};
export const viewProductById = async (req, res) => {
  const { pid } = req.params;
  const product = await productsRepository.getElementByIdLean(pid);
  res.render("../views/product", {
    productId: pid,
    product,
  });
};
export const viewCartById = async (req, res) => {
  const { cid } = req.params;
  const cartData = await cartsRepository.getCartPopulate(cid);
  res.render("../views/cart", {
    cartId: cid,
    cart: cartData.products,
  });
};
export const viewRegister = async (req, res) => {
  res.render("register", {});
};
export const viewLogin = async (req, res) => {
  res.render("login", {});
};
export const viewProfile = async (req, res) => {
  const userData = req.user;

  res.render("profile", {
    userFirstName: userData.user.first_name,
    userLastName: userData.user.last_name,
    userAge: userData.user.age,
    userEmail: userData.user.email,
  });
};

export const reestablecerContrasenia = async(req,res) =>{

  res.render("reestablecerContrasenia",{});
}

export const mandarEmail = async (req,res) =>{
  res.render("mandarEmail",{});
}