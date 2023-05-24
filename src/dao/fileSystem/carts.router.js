import { Router } from "express";
import fs from "fs";
import products from "../../products.json" assert { type: "json", integrity: "sha384-ABC123" };

const router = Router();
let carts = [];
try {
  carts = JSON.parse(fs.readFileSync("carts.json"));
} catch (err) {
  console.log("error loading files in the cart", err);
}

// new cart
router.post("/", (req, res) => {
  const newCart = {
    id: carts.length + 1,
    products: [],
  };
  carts.push(newCart);
  console.log(newCart);
  res.send({ status: "success", message: "nuevo carrito creado." });
  exportCartsToJSON("carts.json");
});

// search products from the cart id
router.get("/:cid", (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = carts.find((cart) => cart.id === cartId);
  if (!cart) {
    return res.status(404).send(error);
  }
  res.send(cart.products);
});

router.post("/:cid/product/:pid", function (req, res) {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = carts.find((e) => e.id === parseInt(cartId));
  if (!cart) {
    res.status(404).send("cart not found.");
    return;
  }
  // Buscar el producto correspondiente en el array de productos
  const productIndex = products.findIndex((p) => p.id === parseInt(productId));
  if (productIndex === -1) {
    res.status(404).send("product not found.");
    return;
  }
  products[productIndex].quantity--;

  const existingProduct = cart.products.find(
    (e) => e.product === parseInt(productId)
  );
  if (existingProduct) {
    // if producto existe incrementa el quantity.
    existingProduct.quantity++;
  } else {
    // si prod no existe ,se agrega al array de productos.
    cart.products.push({ product: parseInt(productId), quantity: 1 });
  }

  res.send(cart);
  fs.writeFile("../products.json", JSON.stringify(products), function (err) {
    if (err) {
      res.status(404).json(err);
    }
    console.log("se actualizo el carts.json.");
  });
  exportCartsToJSON("carts.json");
});

// export prod to JSON
const exportCartsToJSON = (file) => {
  const cartsJSON = JSON.stringify(carts);
  const filePath = "carts.json";
  fs.truncate(filePath, 0, () => {
    fs.writeFile(filePath, cartsJSON, (err) => {
      if (err) {
        throw new Error(`error al escribir el archivo. ${err}`);
      } else {
        console.log(
          `Products have been successfully added to the file ${file}`
        );
      }
    });
  });
};

export default router;
