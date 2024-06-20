import { productsRepository } from "../../repositories/index.js";
import productModel from "../../dao/mongo/models/product.model.js";
import CustomError from "../errors/CustomError.js";
import { ErrorCodes } from "../errors/enums.js";

class ProductService {
  constructor() {}

  async getProducts(limit, page, sort, query) {
    let result = await productsRepository.getProducts(limit, page, sort, query);
    return result;
  }

  async codeExists(product) {
    return await productModel.findOne({ code: product.code });
  }

  async createProduct(product) {
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
    console.log(codeExists)
    if (codeExists ) {
     CustomError.createError({
        name: "Product with this code already exists",
        cause: "code duplicado",
        message: "Error trying to create Product",
        code: ErrorCodes.DUPLICATE_CODE,
      });
    }
    let result = await productsRepository.createProduct(product);
    return result;
  }

  async getProductById(id) {
    let result = await productsRepository.getProductById(id);
    return result;
  }
  async updateProductById(id, data) {
    let result = await productsRepository.updateProductById(id, data);
    return result;
  }
  async deleteProductById(id) {
    let result = await productsRepository.deleteProductById(id);
    return result;
  }
}

const productsService = new ProductService();
export default productsService;
