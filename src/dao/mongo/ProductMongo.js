import productModel from "./models/productModel.js";

export default class Product {
  constructor() {}

  async get(limit, page, sort, query) {
    limit = !limit ? 10: parseInt(limit);
    page = !page ? 1 : parseInt(page);
    query = !query ? {} : { title: query };
    const options = {
      limit: limit,
      page: page,
    };
    let prevPageLink = `http://localhost:8080/api/products?limit=${limit}&page=${
      page - 1
    }&sort=${sort}`;
    let nextPageLink = `http://localhost:8080/api/products?limit=${limit}&page=${
      page + 1
    }&sort=${sort}`;
    if (sort == 'desc' || sort == 'asc') {
      const sortOrder = sort === "desc" ? -1 : 1;
      options.sort = { price: sortOrder };
    } else {
      prevPageLink = `http://localhost:8080/api/products?limit=${limit}&page=${page - 1}`;
      nextPageLink = `http://localhost:8080/api/products?limit=${limit}&page=${page + 1}`;
    }
    const paginate = await productModel.paginate(query, options);
    const response = {
      data: paginate.docs,
      doc:paginate.totalDocs,
      totalPages: paginate.totalPages,
      prevPage: paginate.prevPage,
      nextPage: paginate.nextPage,
      page: paginate.page,
      count_paging: paginate.pagingCounter,
      hasPrevPage: paginate.hasPrevPage,
      hasNextPage: paginate.hasNextPage,
      prevLink: paginate.prevPage != null ? `${prevPageLink}` : null,
      nextLink: paginate.nextPage != null ? `${nextPageLink}` : null,
    };
    return response;
  }

  async create(elements) {
    return await productModel.insertMany(elements);
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
