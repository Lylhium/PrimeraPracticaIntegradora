import mongoose from "mongoose";
import db from "./db.js";

const collection = "products";

const schema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Thumbnail: {
    type: String,
    required: false,
  },
});

schema.statics.createProduct = async function (prod) {
  try {
    const newProduct = new this(prod);
    const result = await newProduct.save();
    return result;
  } catch (error) {
    console.error("Error creating the product", error);
    throw error;
  }
};

const productModel = db.model(collection, schema);

export default productModel;
