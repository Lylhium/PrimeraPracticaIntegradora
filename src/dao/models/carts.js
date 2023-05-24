import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  products: {
    type: [Number],
    default: [],
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
