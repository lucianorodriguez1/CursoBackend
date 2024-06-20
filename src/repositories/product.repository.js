import ProductDTO from "../dao/DTO/product.dto.js";
import productsService from "../services/products/productsService.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getProducts(limit, page, sort, query) {
    let result = await this.dao.get(limit, page, sort, query);
    return result;
  }

  async createProduct(product) {
    let productToInsert = new ProductDTO(product);
    let result = await this.dao.create(productToInsert);
    return result;
  }

  async getProductById(id) {
    let result = await this.dao.getById(id);
    return result;
  }
  async updateProductById(id, data) {
    let result = await this.dao.update(id, data);
    return result;
  }
  async deleteProductById(id) {
    let result = await this.dao.delete(id);
    return result;
  }
}
