//Guardar:
/**
 * 
 * 
 * 
 * 
*/
//GUARDAR HECHO
/**
 * agregar func getUserResponseForRole que devuleve una estructura de usuario en base al rol en userdto y devuelve error si no hay rol. cambiar el getUsers de userSession para que devuelva la estructura . agregar passportcall a GET de userRoutes
 */
//mejorar
/**
 * cambiar el nombre de archivos dao por mongo, product.dao --> product.mongo
 * cambiar el nombre a docs/products a docs/product. y cart
 *  controlar el error cuando se tarda mucho tiempo al consultar a la base de datos
 * cambiar nombres de archivos con . por mayus, --> product.services a productsServices
 */

// preguntar a ger
/**
 * los problemas con el logger personalizado
 * donde puedo tener archivo para documentar todas estas pruebas.
 * 
 */
//probar
/**
 * donde se guardan los loggers de error en produccion
 * crear usuario con campos vacios.
 */
import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from 'path'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

import config from "./config/config.js";
import initializatePassport from "./utils/passport.js";
import errorHandler from "./middlewares/errorHandler.js";
import routeErrorHandler from "./middlewares/routeErrorHandler.js";
import { addLogger } from "./utils/logger.js";
import routes from './routes/index.js';
import viewsRouter from "./routes/views.routes.js";

const app = express();
const __dirname = path.resolve();
const PORT = config.port;


app.listen(PORT, () => {
  console.log(`listening to the server on PORT ${config.port}`);
});

//generar documentacion api
const swaggerOptions = {
  definition:{
    openapi:'3.0.1',
    info:{
      title:'Documentacion de e-commerce coder',
      description:'API para el ecommerce'
    }
  },
  apis:[`${path.join(__dirname)}/src/docs/**/*.yaml`]
}
const specs = swaggerJsDoc(swaggerOptions);
app.use('/apidocs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs));

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

app.use(routeErrorHandler);
app.use(errorHandler);
