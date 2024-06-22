import productsService from "../services/productsServices.js";
import { response } from "../utils/response.js";

export const getProducts = async (req, res) => {
  let { limit, page, sort, query } = req.query;
  let data = await productsService.getProducts(limit, page, sort, query);
  response(res, 200, data);
};

export const createProduct = async (req, res) => {
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
