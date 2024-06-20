import { productsRepository } from "../../repositories/index.js";
import productModel from "../../dao/mongo/models/product.model.js";
import CustomError from "../errors/CustomError.js";
import { ErrorCodes } from "../errors/enums.js";
import { generateProductErrorInfo } from "../errors/info.js";

class ProductService {
  constructor() {}

  async getProducts(limit, page, sort, query) {
    let result = await productsRepository.getProducts(limit, page, sort, query);
    return result;
  }

  async codeExists(product, excludeId = null) {
    const query = { code: product.code };
    if (excludeId) {
        query._id = { $ne: excludeId };  
    }
    return await productModel.findOne(query);
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
    if (codeExists) {
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
    if (!result)
      CustomError.createError({
        name: "INVALID ID",
        cause: "invalid id",
        message: "Error get product",
        code: ErrorCodes.INVALID_ID,
      });
    return result;
  }

  async deleteProductById(id) {
    let result = await productsRepository.deleteProductById(id);
    if (!result)
      CustomError.createError({
        name: "INVALID ID",
        cause: "invalid id",
        message: "Error get product",
        code: ErrorCodes.INVALID_ID,
      });
    return result;
  }

  //1. da error si dejo el code como estaba
  //2.que no permita campos vacios
  async updateProductById(id, data) {
    const codeExists = await this.codeExists(data, id);  
    if (codeExists) {
        CustomError.createError({
            name: "Product with this code already exists",
            cause: "code duplicado",
            message: "Error trying to update Product",
            code: ErrorCodes.DUPLICATE_CODE,
        });
    }

    let result = await productsRepository.updateProductById(id, data);
    if (!result)
      CustomError.createError({
        name: "INVALID ID",
        cause: "invalid id",
        message: "Error get product",
        code: ErrorCodes.INVALID_ID,
      });
    return result;
  }
}

const productsService = new ProductService();
export default productsService;
