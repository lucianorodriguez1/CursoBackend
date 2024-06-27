import {Product} from "../dao/factory.js"
import {Cart} from "../dao/factory.js"
import {User} from "../dao/factory.js"


import ProductRepository from "./ProductRepository.js"
import CartRepository from "./CartRepository.js"
import UserRepository from "./UserRepository.js"

export const productsRepository =  new ProductRepository(new Product());
export const cartsRepository =  new CartRepository(new Cart());
export const usersRepository =  new UserRepository(new User());