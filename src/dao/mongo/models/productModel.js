import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema(
  {
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
    owner: {
      type: String,
      default: "admin",
    },
    productImages: [
      {
        name: String,
        reference: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
