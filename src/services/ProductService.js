import { cartsRepository, productsRepository } from "../repositories/index.js";
import CustomError from "./errors/CustomError.js";
import { ErrorCodes } from "./errors/enums.js";
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
      ProductDTO.getProductResponseForRole(prod, role, email)
    );
    result.data = products;
    return result;
  }

  async codeExists(product, excludeId = null) {
    const query = { code: product.code };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return await productsRepository.getProductBy(query);
  }

  async createProduct(product, email, role) {
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

  async getProductById(id, role,email) {
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
    const productDto = ProductDTO.getProductResponseForRole(result, role,email);
    return productDto;
  }

  async deleteProductById(id, email, role) {
    const product = await this.getProductById(id);
    await cartsRepository.removeDeletedProductsFromcart(id);
    if (role == "premium" && email == product.owner) {
      await productsRepository.deleteProductBy({ _id: id });
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
      await productsRepository.deleteProductBy({ _id: id });
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

  async updateProductById(id, data, role, email) {
    const product = await productsRepository.getProductBy({ _id: id });
    if (!product)
      CustomError.createError({
        name: "producto no encontrado",
        cause: "invalid id",
        message: "Error get product",
        code: ErrorCodes.INVALID_ID,
      });
    if (product.owner != email && role != "admin")
      CustomError.createError({
        name: "el producto no se puede actualizar",
        cause: "no tiene permisos para actualizar el producto",
        message: "Error actualizar product",
        code: ErrorCodes.NOT_PERMISSION_DELETE_PRODUCT,
      });
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
    await productsRepository.updateProductBy({ _id: id }, data);
    return "Se actualizo el producto";
  }

  async upddatePurchaseProductById(pid, quantity) {
    await productsRepository.updatePurchaseProductById(pid, quantity);
    return "Se actualizo el producto por la compra";
  }

  async uploadProductImages(pid, images) {
    if (!images || images.length === 0) {
      return "No se subieron imágenes de producto.";
    }
  
    const imageReferences = images.map(image => ({
      name: image.originalname,
      reference: image.path,
    }));
  
    const updateData = {
      $push: {
        productImages: {
          $each: imageReferences,
        },
      },
    };
  
    await this.updateProductById(pid, updateData);
    return `Se subieron ${images.length} imágenes de producto.`;
  }
}

const productService = new ProductService();
export default productService;
