import express from "express";
const router = express.Router();

import ProductManager from "../dao/controllers/products.js";
import CartModel from "../dao/models/carts.js";

import { uploader } from "../utils.js";

router.get("/products/register", (req, res) => {
  res.render("register");
});

router.post(
  "/products/register",
  uploader.single("Thumbnail"),
  async (req, res) => {
    const { Title, Description, Price } = req.body;

    const filename = req.file.filename;

    if (!Title || !Description || !Price || !filename)
      return res.status(400).send({ error: "Incomplete values" });

    let product = {
      Title,
      Description,
      Price,
      Thumbnail: filename,
    };

    try {
      const productManager = new ProductManager();
      const createdProduct = await productManager.createProduct(product);

      // adding product
      let cart = await CartModel.findOne({});

      if (!cart) {
        // if cart don't exist...
        cart = new CartModel({ products: [] });
      }

      cart.products.push(createdProduct);
      await cart.save();

      res.status(200).send({ success: "Product created!" });
    } catch (error) {
      console.error("Error creating the product", error);
      res.status(500).send({ error: "Error creating the product" });
    }
  }
);

router.get("/products/list", async (req, res) => {
  try {
    const productManager = new ProductManager();
    const products = await productManager.getProducts();
    res.status(200).render("index", { products: products });
  } catch (error) {
    console.error("Error getting the list of products", error);
    res.status(500).json({ error: "Error getting the list of products:" });
  }
});

export default router;
