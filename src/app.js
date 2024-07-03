import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from "path";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import config from "./config/config.js";
import initializatePassport from "./utils/passport.js";
import errorHandler from "./middlewares/errorHandler.js";
import routeErrorHandler from "./middlewares/routeErrorHandler.js";
import { addLogger } from "./utils/logger.js";
import routes from "./routes/index.js";
import viewsRouter from "./routes/views.routes.js";

const app = express();
const __dirname = path.resolve();
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`listening to the server on http://localhost:${PORT}`);
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de e-commerce coder",
      description: "API para el ecommerce",
    },
  },
  apis: [`${path.join(__dirname)}/src/docs/**/*.yaml`],
};
const specs = swaggerJsDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

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
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

app.use(routeErrorHandler);
app.use(errorHandler);

//Guardar:
/**
 * 
 */
//Probar:
/**
 * TODO
 * agregar fecha de creacion en todos las colecciones.
 * 
 * PRODUCTOS
 * get con sort -1 de products
 * devolver al owner si es el propietaria del producto todo las caracteristicas.
 * 
 * USUARIOS
 * funcion deleteInactives de sessionServices (borrar usuarios por inactividad y mandarles un correo)
 * *  Si se sube una imagen de perfil, deberá guardarlo en una carpeta profiles, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products, mientras que ahora al cargar un documento, multer los guardará en una carpeta documents.
 *  Modificar el endpoint /api/users/premium/:uid   para que sólo actualice al usuario a premium si ya ha cargado los siguientes documentos:
 *    Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
 *    En caso de llamar al endpoint, si no se ha terminado de cargar la documentación, devolver un error indicando que el usuario no ha terminado de procesar su documentación.(Sólo si quiere pasar de user a premium, no al revés)
 * arreglar github en passport
 * ver permisos de user.routes
 * 
 * CART
 * Mejorar la eficiencia del addProd de cart.dao.js
 * arreglar el CartModel del CartService(sacarlo y poner la funcion en el controlador del metodo getProductInCart).
 * verificar si puedo borrar los mensajes de de los metodos de CartService si no se encuentra el cart ya que el mensahje esta declarada en la funcion getCartById.
 * 
 * SESSION
 * hacer token de login con expiracion de 4 horas. y al expirarse actualizar la ultima conexion del usuario.
 * 
 * TICKET
 * Crear la funcion en TicketDTO para devolver un formato de fecha vistoso para el usuario en el campo 'purchase_datatime'.
 * Crear errores en TicketsService.
 * 
 * DESAFIO COMPLEMENTARIO 
 *    documentar el modulo API DE productos (DELETE,POST)
 *    documentar el modulo API de carts (GET,GET,DELETE,UPDATE,UPDATE)
 * 
 * DESAFIO TESTING
 *    desarrollar 3 test(mocha,cai y supertest) para routers de products
 *    desarrollar 3 test(mocha,cai y supertest) para routers de carts
 *    desarrollar 3 test(mocha,cai y supertest) para routers de sessions
 * 
 * VISTAS
 * Ver porque me da el error de ruta cuando hago un get de las rutas de views.
 * Poner la ruta views en routes/web y crear su index
 */
