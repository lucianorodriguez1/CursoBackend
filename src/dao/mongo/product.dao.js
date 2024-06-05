import productModel from "./models/product.model.js";

export default class Product {
  constructor() {}
  async get(limit, page, sort, query) {
    try {
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
        status: "success",
        payload: paginate.docs,
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
    } catch (error) {
      console.log(error);
    }
  }
  async create(elements) {
    try {
      return await productModel.insertMany(elements);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(
          "El código del producto ya existe en la base de datos."
        );
      }
    }
  }
  async getById(id) {
    try {
      return await productModel.findOne({ _id: id });
    } catch (error) {
      console.log(error);
    }
  }
  async update(id, data) {
    try {
      return await productModel.findOneAndUpdate(
        { _id: id },
        { ...data },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async delete(id) {
    try {
      return await productModel.findOneAndDelete({ _id: id });
    } catch (error) {
      console.log(error);
    }
  }
}
