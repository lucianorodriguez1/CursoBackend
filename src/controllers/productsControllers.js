import productService from "../services/ProductService.js";
import { response } from "../utils/response.js";

export const getProducts = async (req, res) => {
  let { limit, page, sort, query } = req.query;
  let data = await productService.getProducts(limit, page, sort, query);
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

  const data = await productService.createProduct(
    {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    },
    req.user.user.email,
    req.user.user.role
  );
  response(res, 201, data);
};

export const getProductById = async (req, res) => {
  const id = req.params.pid;
  const result = await productService.getProductById(id);
  response(res, 200, result);
};

export const deleteProductById = async (req, res) => {
  let id = req.params.pid;
  const result = await productService.deleteProductById(
    id,
    req.user.user.email,
    req.user.user.role
  );
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

  const result = await productService.updateProductById(id, {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  });
  response(res, 200, result);
};
