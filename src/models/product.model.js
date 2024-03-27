import mongoose from "mongoose";
import { ManagerMongoDB } from "../db/ManagerMongoDB.js";

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

export class ProductManagerMongoDB extends ManagerMongoDB {
  constructor() {
    super(process.env.URL_MONGODB, ProductCollection, productSchema);
    //aqui irian los atributos propios de la clase
  }

  //Aqui irian los metodos propios de la clase
}

export const productManager = new ProductManagerMongoDB();
//export const productModel = mongoose.model(ProductCollection, productSchema);
