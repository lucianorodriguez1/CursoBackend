import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import __dirname from "./utils.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";

const app = express();
const PORT = 8080;
const serverHTTP = app.listen(PORT, () => {
  console.log(`listening to the server on PORT ${PORT}`);
});

//DESAFIO WEBSOCKETS-----------------------
import ProductManager from "./models/ProductManager.js";

const socketServer = new Server(serverHTTP);
const productManager = new ProductManager("./products.json");

socketServer.on("connection", async(socket) => {
  
  socket.on('newProduct', async(product)=>{
    try {
      const response = await productManager.addProduct(product);
      socket.emit("products",(await productManager.getProducts()));
    } catch (error) {
      console.log(error)
    }
  });

  

  socket.on('idProductDelete',async(id)=>{
    try {
      const response = (await productManager.deleteProduct(id));
      console.log(id);
      socket.emit("products",(await productManager.getProducts()));
    } catch (error) {
     console.log(error); 
    }
  })
  /*
  //evento para socket individual
  socket.emit();
  //evento para todos los sockets menos el actual
  socket.broadcast.emit();
  //evento para todos 
  socket.emit();
  */
});
//DESAFIO WEBSOCKETS TERMINADO-----------------------


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../public"));

app.use("/api/products/", productRouter);
app.use("/api/carts/", cartRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

//MONGO DB CONEXION y DO
dotenv.config();

mongoose.connect(process.env.URL_MDBATLAS)
.then(() => {
  console.log('Conexión exitosa a la base de datos');
})
.catch(error => {
  console.log("No se puede conectar a la base de datos: " + error);
  process.exit(1); // Salir del proceso con un código de error
});
