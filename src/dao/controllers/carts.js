import Cart from "../models/carts.js";

class CartManager {
  async addToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.products.push(productId);
      await cart.save();

      return cart;
    } catch (error) {
      console.error("Error adding product to cart", error);
      throw error;
    }
  }
}

export default CartManager;
