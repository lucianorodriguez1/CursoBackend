import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from 'session-file-store'
import MongoStore from "connect-mongo";
import morgan from "morgan";
import "dotenv/config";
import __dirname from "./utils.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
import messageRouter from "./routes/message.routes.js";
import sessionRouter from "./routes/session.routes.js"
import userRouter from "./routes/user.routes.js"
import { messageManager } from "./dao/MongoDB/managers/message.dao.js";
import { connnectDB } from "./utils/mongo.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js"

const app = express();
const fileStore = FileStore(session);
const PORT = 8080;
const serverHTTP = app.listen(PORT, () => {
  console.log(`listening to the server on PORT ${PORT}`);
});
connnectDB();

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../public"));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  store: MongoStore.create({
    mongoUrl:process.env.URL_MONGODB,
    //mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},  OPCIONES OBSOLETAS?
    ttl:1500,
  }),
  secret:'secrett',
  resave:true,
  saveUninitialized:true
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products/", productRouter);
app.use("/api/carts/", cartRouter);
app.use("/api/messages/", messageRouter);
app.use("/api/users/",userRouter);
app.use("/api/sessions/", sessionRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

