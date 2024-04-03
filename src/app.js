import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import morgan from "morgan";
import "dotenv/config";
import __dirname from "./utils.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
import messageRouter from "./routes/message.routes.js";

const app = express();
const PORT = 8080;
const serverHTTP = app.listen(PORT, () => {
  console.log(`listening to the server on PORT ${PORT}`);
});

//DESAFIO WEBSOCKETS-----------------------
import ProductManager from "./dao/filesystem/ProductManager.js";

const socketServer = new Server(serverHTTP);
const productManager = new ProductManager("./data/products.json");

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
app.use(morgan('dev'));

app.use("/api/products/", productRouter);
app.use("/api/carts/", cartRouter);
app.use("/api/messages/", messageRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

