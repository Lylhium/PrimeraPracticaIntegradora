import { Router } from "express";
import fs from "fs";
const router = Router();
let products = [];

// Exportar productos a JSON
const exportProductsToJSON = (fileName) => {
  const productsJSON = JSON.stringify(products);
  const filePath = "products.json";
  fs.truncate(filePath, 0, () => {
    fs.writeFile(filePath, productsJSON, (err) => {
      if (err) {
        throw new Error(`error writing file ${err}`);
      } else {
        console.log(
          `Products have been successfully added to the file ${fileName}`
        );
      }
    });
  });
};

//pagina products y filtrado limit
router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit);
  if (!limit) {
    return res.send({ products });
  } else {
    products = products.slice(0, limit);
    return res.send(products);
  }
});

// filtrado query por ID
router.get("/:pid", (req, res) => {
  // Recibir ID del producto
  const productsId = parseInt(req.params.pid);

  const product = products.find((product) => product.id === productsId);
  if (!product) {
    // Si  no existe el producto, enviar error
    const error = { error: "Product not found" };
    return res.status(404).send(error);
  }
  // Si existe el producto, mostrar el producto con el ID especifico
  res.send(product);
});

router.post("/", (req, res) => {
  const { title, description, price, thumbnails, code, stock, category } =
    req.body;
  if (!title || !description || !price || !code || !stock || !category) {
    return res
      .status(400)
      .send({ status: "error", error: "valores incompletos." });
  }

  const newProduct = {
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
    id: products.length + 1,
  };

  products.push(newProduct);
  res.send({ status: "success", message: "Producto Agregado." });
  exportProductsToJSON("products.json");
});

// update product
router.put("/:pid", (req, res) => {
  // Buscar el producto con el ID solicitado
  const product = products.find((p) => p.id === parseInt(req.params.pid));
  if (!product) {
    return res.status(404).send("no se encontró el producto");
  }
  product.title = req.body.title || product.title;
  product.description = req.body.description || product.description;
  product.code = req.body.code || product.code;
  product.price = req.body.price || product.price;
  product.status = req.body.status || product.status;
  product.stock = req.body.stock || product.stock;
  product.category = req.body.category || product.category;
  product.thumbnails = req.body.thumbnails || product.thumbnails;

  // update JSON file
  const productsJSON = JSON.stringify(products);
  fs.writeFile("products.json", productsJSON, (err) => {
    if (err) {
      return res.status(500).send({ error: `error writing file ${err}` });
    } else {
      return res.status(200).json({
        status: "success",
        message: "valores del producto actualizado.",
      });
    }
  });
});

router.delete("/:pid", (req, res) => {
  // busca prod por el id
  const product = products.find((p) => p.id === parseInt(req.params.pid));
  if (!product) {
    // Si no se encuentra, enviar mensaje de error
    return res.status(404).send("No se encontro el producto.");
  }

  // Modificar el array para eliminar el producto
  products = products.filter(
    (product) => product.id != parseInt(req.params.pid)
  );

  // update del JSON
  const productsJSON = JSON.stringify(products);
  fs.writeFile("products.json", productsJSON, (err) => {
    if (err) {
      return res.status(500).send({ error: `error writing file ${err}` });
    } else {
      return res
        .status(200)
        .send({ status: "success", message: "Product deleted." });
    }
  });
});

export default router;
