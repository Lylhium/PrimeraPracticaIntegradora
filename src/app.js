//express y handlebars
import express from "express";
import { engine } from "express-handlebars";
//path
import path from "path";
// dirName para Upload Imagenes.
import __dirname from "./utils.js";
//import de Router
import router from "./routes/routes.js";
// FileSystem
import productsRouter from "./dao/fileSystem/products.router.js";
import cartsRouter from "./dao/fileSystem/carts.router.js";
//import socket-io y controller de message
import { Server } from "socket.io";
import Message from "./dao/models/message.js";
import {
  getAllMessages,
  createMessage,
} from "../src/dao/controllers/message.js";
// cart
import CartManager from "./dao/controllers/carts.js";
// express y listen de servidor
const app = express();
const PORT = process.env.PORT || 3030;
const server = app.listen(PORT, () => console.log(`Listen on port ${PORT}`));

// inicializacion de socket-io
const io = new Server(server);

//handlebars y express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

const publics = path.join(__dirname, "./public");
app.use(express.static(publics));

//ruta principal del server y uso de router
app.use("/", router);

// config de socket-io y conexion de usuario
io.on("connection", (socket) => {
  console.log("user connected.");

  // Escuchar el evento 'chat message'
  socket.on("chat message", async (data) => {
    const { user, message } = data;

    // Guarda el mensaje en mongo
    const newMessage = new Message({ user, message });
    await newMessage.save();
    console.log("Mensaje guardado en MongoDB");

    // evento de 'chat message' a todos los clientes conectados
    io.emit("chat message", data);
  });

  // desconexión del usuario del socket-io
  socket.on("disconnect", () => {
    console.log("user disconnected.");
  });
});

// renderizado pagina de chat
app.get("/chat", (req, res) => {
  res.render("chats");
});
// Ruta para obtener todos los mensajes
app.get("/chats", getAllMessages);

// Ruta para crear un nuevo mensaje
app.post("/chats", createMessage);

const cartManager = new CartManager();

// Ruta para crear un carrito
app.post("/carts", async (req, res) => {
  try {
    const cartId = req.query.cartId; // Obtén el valor del parámetro cartId de la URL
    const cart = await CartManager.createCart(cartId); // Llama al método createCart del CartManager
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error creating cart" });
  }
});

app.post("/carts/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const cart = await cartManager.addToCart(
      parseInt(cartId),
      parseInt(productId)
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FS : products utilizando router
app.use("/api/products/", productsRouter);

// products utilizando router
app.use("/api/carts/", cartsRouter);

export default app;
