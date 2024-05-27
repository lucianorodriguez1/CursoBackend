import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import "dotenv/config";
import passport from "passport";

import __dirname from "./utils.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/session.routes.js"
import userRouter from "./routes/user.routes.js"
import { connnectDB } from "./utils/mongo.js";
import initializatePassport from "./config/passport.config.js"

const app = express();

const PORT = 8080;
const serverHTTP = app.listen(PORT, () => {
  console.log(`listening to the server on PORT ${PORT}`);
});
connnectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../public"));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  store: MongoStore.create({
    mongoUrl:process.env.URL_MONGODB,
    ttl:1500,
  }),
  secret:'secret',
  resave:false, 
  saveUninitialized:false
}))
initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products/", productRouter);
app.use("/api/carts/", cartRouter);
app.use("/api/users/",userRouter);
app.use("/api/sessions/", sessionRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

