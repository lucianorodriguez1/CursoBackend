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
 * manejar el error cuando se espera un :id params en una busqued y se introduce algo equivocado en getProductById de ProductService.
 */

//PRIORIDAD
/**
 * *
 * 
 * Si se elimina un prducto de la base de dato que se borre de los carritos.
 * Ver si esta bien devolver el producto por el controlador al crear un modelo.
 * acordarse de poner el code en el ProductDto
 * Si el producto tiene stock 0 modificar el status a false.
 * 
 * ver permisos de user.routes
 * como puedo hacer req.user.campo y no req.user.user.campo
 * ver el GET de api/users/current para saber qie informacion devolver. Cuando llamo a GET de users ver que se mande el DTO de users con DTO de cart en CartId.
 * enviar mediante UserDto el documento del usuario si tiene, y sino que se muestre 'No tiene documentos'
 * en GET user sacar el password de la respuesta
 * 
 * poner en el DTO de cart los quantity de los productos.
 * 
 */

//Probar:
/**
 * PRODUCTOS
 * get con sort -1 de products
 * 
 * USUARIOS
 * funcion deleteInactives de sessionServices (borrar usuarios por inactividad y mandarles un correo)
 * *  Si se sube una imagen de perfil, deberá guardarlo en una carpeta profiles, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products, mientras que ahora al cargar un documento, multer los guardará en una carpeta documents.
 *  Modificar el endpoint /api/users/premium/:uid   para que sólo actualice al usuario a premium si ya ha cargado los siguientes documentos:
 *    Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
 *    En caso de llamar al endpoint, si no se ha terminado de cargar la documentación, devolver un error indicando que el usuario no ha terminado de procesar su documentación.(Sólo si quiere pasar de user a premium, no al revés)
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
 * PURCHASE
 * si yo quiero hacer purchase del carrito devolver. el cart esta vacio.
 * 
 * ERRORES
 
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
