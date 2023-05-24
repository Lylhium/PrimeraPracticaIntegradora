import mongoose from "mongoose";

mongoose.connect(
  `mongodb+srv://lilius:dEADLERDEATH123@cluster0.gsoks.mongodb.net/`,
  {
    dbName: "ecommerce",
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error en conectarse a MongoDB"));
db.once("open", () => {
  console.log("Conexión satisfactoria a MongoDB");
});

export default db;
