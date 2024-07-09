import productService from "../services/ProductService.js";
import { response } from "../utils/response.js";

export const getProducts = async (req, res) => {
  let { limit, page, sort, query } = req.query;
  const role = req.user?.data?.role || null;
  const email = req.user?.data?.email || null;
  let data = await productService.getProducts(limit, page, sort, query, role,email);
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
    req.user.data.email,
    req.user.data.role
  );
  response(res, 201, data);
};

export const getProductById = async (req, res) => {
  const id = req.params.pid;
  const role = req.user?.data?.role || null;
  const email = req.user?.data.email || null;
  const result = await productService.getProductById(id,role,email);
  response(res, 200, result);
};

export const deleteProductById = async (req, res) => {
  let id = req.params.pid;
  const result = await productService.deleteProductById(
    id,
    req.user.data.email,
    req.user.data.role
  );
  response(res, 200, result);
};

export const updateProductById = async (req, res) => {
  const id = req.params.pid;
  const email = req.user?.data?.email || null
  const role = req.user?.data?.role || null;
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail,
  } = req.body;

  const result = await productService.updateProductById(id, {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail,
  },role,email);
  response(res, 200, result);
};

export const uploadProductImages = async(req,res) =>{
  const productId = req.params.pid;
  const images = req.files || [];
  if (images.length === 0) {
    return res.status(400).json({ message: 'No se subieron imágenes de producto.' });
  }

  const result = await userService.uploadProfilePhoto(productId,images);
  response(res, 200, result);
}



