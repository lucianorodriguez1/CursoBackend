import productModel from "./models/product.model.js";

export default class Product {
  constructor() {}
  async get(limit, page, sort, query) {
    limit = !limit ? 10 : parseInt(limit);
    page = !page ? 1 : parseInt(page);
    query = !query ? {} : { title: query };
    const options = {
      limit: limit,
      page: page,
    };
    if (sort) {
      const sortOrder = sort === "desc" ? -1 : 1;
      options.sort = { price: sortOrder };
    }
    const paginate = await productModel.paginate(query, options);
    const response = {
      data: paginate.docs,
      totalPages: paginate.totalPages,
      prevPage: paginate.prevPage,
      nextPage: paginate.nextPage,
      page: paginate.page,
      hasPrevPage: paginate.hasPrevPage,
      hasNextPage: paginate.hasNextPage,
      prevLink:
        paginate.prevPage != null
          ? `http://localhost:8080/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}`
          : null,
      nextLink:
        paginate.nextPage != null
          ? `http://localhost:8080/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}`
          : null,
    };
    return response;
  }
  async create(elements) {
    try {
      return await productModel.insertMany(elements);
    } catch (error) {
      return error.code;
    }
  }
  async getById(id) {
    return await productModel.findOne({ _id: id });
  }
  async update(id, data) {
    return await productModel.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true }
    );
  }
  async delete(id) {
    return await productModel.findOneAndDelete({ _id: id });
  }
}
