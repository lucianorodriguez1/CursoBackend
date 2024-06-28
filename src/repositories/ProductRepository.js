export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getProducts(limit, page, sort, query) {
    let result = await this.dao.get(limit, page, sort, query);
    return result;
  }

  async createProduct(product) {
    let result = await this.dao.create(product);
    return result;
  }

  async getProductBy(params) {
    let result = await this.dao.getBy(params);
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
