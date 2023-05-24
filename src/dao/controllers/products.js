import productModel from "../models/products.js";

class ProductManager {
  constructor() {}

  async createProduct(prod) {
    try {
      // Obtener el último producto agregado
      const lastProduct = await productModel
        .findOne({}, {}, { sort: { id: -1 } })
        .lean();

      // Obtener el último ID y aumentarlo en 1
      const lastProductId = lastProduct ? lastProduct.id : 0;
      const newProductId = lastProductId + 1;

      // Agregar el ID al objeto de producto
      const productWithId = { ...prod, id: newProductId };

      // Crear el nuevo producto
      const result = await productModel.create(productWithId);

      return result;
    } catch (error) {
      console.error("Error creating the product", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await productModel.find({}).lean();
      return products;
    } catch (error) {
      console.error("Error getting the products", error);
      throw error;
    }
  }
}

export default ProductManager;
