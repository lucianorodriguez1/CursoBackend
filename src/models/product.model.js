import mongoose from "mongoose";
import { MongoDBManager } from "../dao/MongoDB/MongoDBManager.js";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductCollection = "products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    index: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  thumbnails: {
    type: Array,
    default: [],
  },
});

productSchema.plugin(mongoosePaginate);

export class ProductMongoDBManager extends MongoDBManager {
  constructor() {
    super(process.env.URL_MONGODB, ProductCollection, productSchema);
  }

  async getProducts(limit, page, sort, category, stock) {
    this.setConnection();
    try {
      limit = !limit ? 10 : parseInt(limit);
      page = !page ? 1 : parseInt(page);
      let query;

      if (category != undefined) {
        query = { category: category };
      } else if (stock != undefined) {
        query = { stock: stock };
      } else {
        query = {};
      }
      const options = {
        limit: limit,
        page: page,
      };
      if (sort) {
        const sortOrder = sort === "desc" ? -1 : 1;
        options.sort = { price: sortOrder };
      }
      const paginate = await this.model.paginate(query, options);
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
      console.log(console.log);
    }
  }

  async createProduct(elements) {
    this.setConnection();
    try {
      return await this.model.insertMany(elements);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(
          "El código del producto ya existe en la base de datos."
        );
      }
    }
  }
}

export const productManager = new ProductMongoDBManager();
