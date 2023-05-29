import mongoose from "mongoose";
import db from "../models/db.js";

const collection = "carts";

const schema = new mongoose.Schema({
  products: {
    type: [
      {
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
      },
    ],
    required: true,
    default: [],
  },
});

const cartModel = db.model(collection, schema);

export default cartModel;
