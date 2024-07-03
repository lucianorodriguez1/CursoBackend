import { cartsRepository, productsRepository } from "../repositories/index.js";
import productModel from "../dao/mongo/models/productModel.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
import { generateProductErrorInfo } from "./errors/info.js";
import ProductDTO from "../dto/ProductDto.js";
import config from "../config/config.js";
import { transport } from "../utils/nodemailer.js";
import { removeEmptyObjectFields } from "../utils/removeEmptyObjectFields.js";
import mongoose from "mongoose";

class ProductService {
  constructor() {}

  async getProducts(limit, page, sort, query, role) {
    let result = await productsRepository.getProducts(limit, page, sort, query);
    const products = result.data.map((prod) =>
      ProductDTO.getProductResponseForRole(prod, role)
    );
    result.data = products;
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
      (!product.stock && product.stock < 0) ||
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
    if (product.stock <= 0) product.status = false;
    const result = await productsRepository.createProduct(product, role);
    const productDto = ProductDTO.getProductResponseForRole(result[0], "admin");
    return productDto;
  }

  async getProductById(id, role) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      CustomError.createError({
        name: "error de casteo de id",
        cause: "object id invalid",
        message: "Error get product",
        code: ErrorCodes.INVALID_ID,
      });
    }
    let result = await productsRepository.getProductBy({ _id: id });
    if (!result)
      CustomError.createError({
        name: "producto no encontrado",
        cause: "invalid id",
        message: "Error get product",
        code: ErrorCodes.INVALID_ID,
      });
    const productDto = ProductDTO.getProductResponseForRole(result, role);
    return productDto;
  }

  async deleteProductById(id, email, role) {
    const product = await this.getProductById(id);
    await cartsRepository.removeDeletedProductsFromcart(id);
    if (role == "premium" && email == product.owner) {
      await productsRepository.deleteProductById(id);
      await transport.sendMail({
        from: `lucho rodri <${config.correoGmail}>`,
        to: product.owner,
        subject: "producto eliminado",
        html: `
            <div>
                <p>Tu producto fue eliminado.</p>
            </div>
            `,
        attachments: [],
      });
      return "El producto fue eliminado por el owner";
    }
    if (role == "admin") {
      await productsRepository.deleteProductById(id);
      if (product.owner != "admin") {
        await transport.sendMail({
          from: `lucho rodri <${config.correoGmail}>`,
          to: product.owner,
          subject: "producto eliminado",
          html: `
              <div>
                  <p>Tu producto fue eliminado.</p>
              </div>
              `,
          attachments: [],
        });
      }
      return "El producto fue eliminado por el admin";
    }

    if (role == "premium" && email != product.owner)
      CustomError.createError({
        name: "el producto no se puede eliminar",
        cause: "no tiene permisos para eliminar producto",
        message: "Error delete product",
        code: ErrorCodes.NOT_PERMISSION_DELETE_PRODUCT,
      });
    return "El producto fue eliminado";
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
    removeEmptyObjectFields(data);
    let result = await productsRepository.updateProductById(id, data);
    if (!result)
      CustomError.createError({
        name: "producto no encontrado",
        cause: "invalid id",
        message: "Error update product",
        code: ErrorCodes.INVALID_ID,
      });
    return "Se actualizo el producto";
  }
  async upddatePurchaseProductById(pid, quantity) {
    await productsRepository.updatePurchaseProductById(pid, quantity);
    return "Se actualizo el producto por la compra";
  }
}

const productService = new ProductService();
export default productService;
