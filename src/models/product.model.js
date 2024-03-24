import mongoose from "mongoose";

const ProductCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: {
    type: Number,
    unique: true,
  },
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnail: Array,
});

export const productModel = mongoose.model(ProductCollection,productSchema);
