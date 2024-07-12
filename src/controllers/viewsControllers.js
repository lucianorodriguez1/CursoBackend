import { productsRepository, cartsRepository } from "../repositories/index.js";

export const viewHome = (req, res) => {
  let user = req.user?.data || null;
  if (user) {
    res.render("index", {
      notUser: false,
    });
  } else {
    res.render("index", {
      notUser: true,
    });
  }
};
export const viewRegister = (req, res) => {
  res.render("register", {});
};
export const viewLogin = (req, res) => {
  res.render("login", {});
};

export const viewProfile = (req, res) => {
  if (!req.user) {
    return;
  }
  const userData = req.user;
  res.render("profile", {
    userFirstName: userData.data.first_name,
    userLastName: userData.data.last_name,
    userAge: userData.data.age,
    userEmail: userData.data.email,
  });
};

export const viewProducts = async (req, res) => {
  let { limit, page, sort, query } = req.query;

  let usernameUser;
  let admin;

  const user = req.user?.data || null;
  if (user) {
    if (user.role == "admin") {
      admin = true;
    }
    if (user.name) {
      usernameUser = req.session.user.first_name;
    }
  } else {
    usernameUser = "";
  }
  const response = await productsRepository.getProducts(
    limit,
    page,
    sort,
    query
  );
  const dataMongoose = response.data;
  const existsNextPage = response.hasNextPage;
  const existsPrevPage = response.hasPrevPage;
  const nextLink = `http://localhost:8080/products?page=${
    response.page + 1
  }&limit=2`;
  const prevLink = `http://localhost:8080/products?page=${
    response.page - 1
  }&limit=2`;
  const products = dataMongoose.map((doc) => doc.toObject());
  res.render("products", {
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
  const product = await productsRepository.getProductLeanBy({_id:pid});
  res.render("product", {
    productId: pid,
    product,
  });
};
export const viewCartById = async (req, res) => {
  const id  = req.params.cid;
  const cartData = await cartsRepository.getCartById(id);
  let purchaseAvailable = false;
  if(cartData.products.length>0){
    purchaseAvailable = true
  }
  res.render("cart", {
    cartId: id,
    cart: cartData.products,
    purchaseAvailable:purchaseAvailable,
  });
  
};

export const reestablecerContrasenia = (req, res) => {
  res.render("reestablecerContrasenia", {});
};

export const mandarEmail = (req, res) => {
  res.render("mandarEmail", {});
};
