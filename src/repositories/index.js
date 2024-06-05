import {Product} from "../dao/factory.js"
import {Cart} from "../dao/factory.js"
import {User} from "../dao/factory.js"

import ProductRepository from "./product.repository.js"
import CartRepository from "./cart.repository.js"
import UserRepository from "./user.repository.js"

export const productsService =  new ProductRepository(new Product());
export const cartsService =  new CartRepository(new Cart());
export const usersService =  new UserRepository(new User());