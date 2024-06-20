import productsService from "../services/products/productsService.js";
import { response } from "../utils/response.js";

//modulos a sacar
import { productsRepository } from "../repositories/index.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import CustomError from "../services/errors/CustomError.js";
import { ErrorCodes } from "../services/errors/enums.js";
//modulos a sacar fin

export const getProducts = async (req, res) => {
  let { limit, page, sort, query } = req.query;
  let data = await productsService.getProducts(limit, page, sort, query);
  response(res, 200, data);
};

export const createProduct = async (req, res, next) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  } = req.body;

  const data = await productsService.createProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  });

  response(res, 201, data);
};

export const getProductById = async (req, res) => {
  const id = req.params.pid;
  const result = await productsService.getProductById(id);
  response(res, 200, result);
};

export const deleteProductById = async (req, res) => {
  let id = req.params.pid;
  const result = await productsService.deleteProductById(id);
  response(res, 200, "producto eliminado");
};
//probar update
export const updateProductById = async (req, res) => {
  const id = req.params.pid;
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  } = req.body;

  const result = await productsService.updateProductById(id, {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  });
  response(res,200,result);
};
