import productService from "../services/ProductService.js";
import { response } from "../utils/response.js";

export const getProducts = async (req, res) => {
  let { limit, page, sort, query } = req.query;
  const role = req.user?.data?.role || null;
  const email = req.user?.data?.email || null;
  let data = await productService.getProducts(
    limit,
    page,
    sort,
    query,
    role,
    email
  );
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
  } = req.body;
  const imagesReferences = req.files;
  if(req.files.length==0) return res.status(400).json({error:false,message:"Se necesita cargar imagen/imagenes del producto"})
  const thumbnails = imagesReferences.map((image) => ({
      name: image.originalname,
      reference: `/img/products/${image.filename}`, 
  }));
  const data = await productService.createProduct(
    {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
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
  const result = await productService.getProductById(id, role, email);
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
  const email = req.user?.data?.email || null;
  const role = req.user?.data?.role || null;
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;

  const result = await productService.updateProductById(
    id,
    {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnail,
    },
    role,
    email
  );
  response(res, 200, result);
};

export const uploadProductImages = async (req, res) => {
  const productId = req.params.pid;
  const images = req.files || [];
  if (images.length === 0) {
    return res
      .status(400)
      .json({ message: "No se subieron imágenes de producto." });
  }

  const result = await productService.uploadProductImages(productId, images);
  response(res, 200, result);
};
