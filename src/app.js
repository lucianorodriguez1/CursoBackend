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
import { messageManager } from "./models/message.model.js";

const app = express();
const PORT = 8080;
const serverHTTP = app.listen(PORT, () => {
  console.log(`listening to the server on PORT ${PORT}`);
});
 
//DESAFIO WEBSOCKETS MEESAGE-----------------------

const io = new Server(serverHTTP);

io.on("connection", async(socket) => {
  socket.on('newMessage', async(message)=>{
    try {
      const response = await messageManager.addElements(message);
    } catch (error) {
      console.log(error)
    }
  });
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

