import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import "dotenv/config";
import passport from "passport";
import path from 'path';

import config from "./config/config.js";
//import __dirname from "./utils/multer.js"; PRUEBA
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/session.routes.js";
import userRouter from "./routes/user.routes.js";
import mockingRouter from "./routes/mocking.routes.js";
import initializatePassport from "./utils/passport.js";
import errorHandler from "./middlewares/errors/index.js";
import messageRouter from "./routes/message.routes.js";
import { addLogger } from "./utils/logger.js";
import loggerRouter from "./routes/logger.routes.js";

const app = express();
const __dirname = path.resolve();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`listening to the server on PORT ${config.port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(__dirname + "/../public")); //probar(esta mal)
app.use(addLogger);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoUrl,
      ttl: 1500,
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products/", productRouter);
app.use("/api/carts/", cartRouter);
app.use("/api/users/", userRouter);
app.use("/api/sessions/", sessionRouter);
app.use("/api/mocking/", mockingRouter);
app.use("/api/messages/",messageRouter);
app.use("/api/loggerTest/", loggerRouter);

app.engine("handlebars", handlebars.engine());

app.set("views",  path.join(__dirname, 'src/views'));
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

app.use(errorHandler);