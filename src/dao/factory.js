import { connnectDB } from "../utils/mongo.js";
import config from "../config/config.js";

export let Product;
export let Cart;
export let User;

switch (config.persistence) {
  case "MONGO":
    connnectDB();
    const { default: ProductMongo } = await import("./mongo/product.dao.js");
    const { default: CartMongo } = await import("./mongo/cart.dao.js");
    const { default: UserMongo } = await import("./mongo/user.dao.js");
    Product = ProductMongo;
    Cart = CartMongo;
    User = UserMongo;
    break;

  default:
    throw new Error("Invalid persistence option");
}
