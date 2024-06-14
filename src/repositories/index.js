import {Product} from "../dao/factory.js"
import {Cart} from "../dao/factory.js"
import {User} from "../dao/factory.js"


import ProductRepository from "./product.repository.js"
import CartRepository from "./cart.repository.js"
import UserRepository from "./user.repository.js"

export const productsRepository =  new ProductRepository(new Product());
export const cartsRepository =  new CartRepository(new Cart());
export const usersRepository =  new UserRepository(new User());