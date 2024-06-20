//1. arreglar el _dirname archivo
//2. arreglar el archivo multer.js
//3. arreglar el middleware de la carpeta public
//4. customizar el logger
import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from 'path'

import config from "./config/config.js";
import initializatePassport from "./utils/passport.js";
import errorHandler from "./middlewares/errorHandler.js";
import { addLogger } from "./utils/logger.js";
import routes from './routes/index.js';
import viewsRouter from "./routes/views.routes.js";

const app = express();
const __dirname = path.resolve();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`listening to the server on PORT ${config.port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));

app.use(addLogger);
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

app.use(routes);

app.engine("handlebars", handlebars.engine());
app.set("views",  path.join(__dirname, 'src/views'));
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

app.use(errorHandler);