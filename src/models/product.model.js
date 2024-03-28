import mongoose from "mongoose";
import {MongoDBManager } from "../dao/MongoDB/MongoDBManager.js";

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

export class ProductMongoDBManager extends MongoDBManager {
  constructor() {
    super(process.env.URL_MONGODB, ProductCollection, productSchema);
  }
}

export const productManager = new ProductMongoDBManager();

