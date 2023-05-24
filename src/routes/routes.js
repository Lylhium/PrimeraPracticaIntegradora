import express from "express";
const router = express.Router();

import ProductManager from "../dao/controllers/products.js";

import { uploader } from "../utils.js";

router.get("/products/register", (req, res) => {
  res.render("register");
});

router.post("/products/register", uploader.single("Thumbnail"), (req, res) => {
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

  const productManager = new ProductManager();
  productManager.createProduct(product);

  res.status(200).send({ success: "Product created!" });
});

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
