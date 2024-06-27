import { productsRepository } from "../repositories/index.js";
import productModel from "../dao/mongo/models/productModel.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import { generateProductErrorInfo } from "./errors/info.js";
import ProductDTO from "../dto/ProductDto.js";

class ProductService {
  constructor() {}

  async getProducts(limit, page, sort, query,role) {
    let products = await productsRepository.getProducts(limit, page, sort, query);
    const result = products.data.map((prod)=> ProductDTO.getProductResponseForRole(prod,role))
    return result;
  }

  async codeExists(product, excludeId = null) {
    const query = { code: product.code };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return await productModel.findOne(query);
  }

  async createProduct(product, email, role) {
    if (
      !product.title ||
      !product.description ||
      !product.code ||
      !product.status ||
      !product.stock ||
      !product.category ||
      !product.thumbnail
    ) {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo({
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnail,
        }),
        message: "Error trying to create Product",
        code: ErrorCodes.INVALID_TYPES_ERROR,
      });
    }
    const codeExists = await this.codeExists(product);
    if (codeExists) {
      CustomError.createError({
        name: "producto con este codigo ya existe.",
        cause: "code duplicado",
        message: "Error trying to create Product",
        code: ErrorCodes.DUPLICATE_CODE,
      });
    }
    if (role == "premium") product.owner = email;

    let result = await productsRepository.createProduct(product);
    return result;
  }

  async getProductById(id) {
    let result = await productsRepository.getProductById(id);
    if (!result)
      CustomError.createError({
        name: "producto no encontrado",
        cause: "invalid id",
        message: "Error get product",
        code: ErrorCodes.INVALID_ID,
      });
    return result;
  }

  async deleteProductById(id, email, role) {
    const product = await this.getProductById(id);
    let result = null;
    if (role == "premium" && email == product.owner)
      return (result = await productsRepository.deleteProductById(id));
    console.log("entre");

    if (role == "admin")
      return (result = await productsRepository.deleteProductById(id));

    if(role == "premium" && email != product.owner)
      CustomError.createError({
        name: "el producto no se puede eliminar",
        cause: "no tiene permisos para eliminar producto",
        message: "Error delete product",
        code: ErrorCodes.NOT_PERMISSION_DELETE_PRODUCT,
      });
    return result;
  }

  async updateProductById(id, data) {
    const codeExists = await this.codeExists(data, id);
    if (codeExists) {
      CustomError.createError({
        name: "producto con este codigo ya existe",
        cause: "code duplicado",
        message: "Error trying to update Product",
        code: ErrorCodes.DUPLICATE_CODE,
      });
    }

    this.removeEmptyFields(data);
    let result = await productsRepository.updateProductById(id, data);
    if (!result)
      CustomError.createError({
        name: "producto no encontrado",
        cause: "invalid id",
        message: "Error update product",
        code: ErrorCodes.INVALID_ID,
      });
    return result;
  }
  removeEmptyFields(obj) {
    for (let key in obj) {
      if (
        obj[key] === null ||
        obj[key] === undefined ||
        obj[key] === "" ||
        (Array.isArray(obj[key]) && obj[key].length === 0) ||
        (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
      ) {
        delete obj[key];
      }
    }
    return obj;
  }
}

const productService = new ProductService();
export default productService;