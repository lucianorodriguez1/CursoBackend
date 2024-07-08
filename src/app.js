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
import tokenExpirationMiddleware from "./middlewares/tokenExpirationMiddleware.js";

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
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

app.use(addLogger);
app.use(cookieParser());
app.use( //borrar
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
app.use(passport.session());//borrar
app.use(tokenExpirationMiddleware)

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
//PROBAR
/**
 *    Si se sube una imagen de perfil, deberá guardarlo en una carpeta profiles, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products, mientras que ahora al cargar un documento, multer los guardará en una carpeta documents.
 *     El usuario puede cambiar a premium solo si ha subido:
 *    Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
 *    En caso de llamar al endpoint, si no se ha terminado de cargar la documentación, devolver un error indicando que el usuario no ha terminado de procesar su documentación.(Sólo si quiere pasar de user a premium, no al revés)
 * 
 * Purchase: 
 *    El usuario solo se puede generar la compra de su propio carrito
 * 
 */


//REALIZAR:
/**
 * DESAFIO TESTING
 *    desarrollar 3 test(mocha,cai y supertest) para routers de products
 *    desarrollar 3 test(mocha,cai y supertest) para routers de carts
 *    desarrollar 3 test(mocha,cai y supertest) para routers de sessions
 * instalar el paquete mocha en desarrollo: 'npm i -D mocha'.
 * 
 * RUTAS
 * Productos:
 *    que el usuario premium solo pueda actualizar su producto
 *    si el usuario premium solicita un producto que el creo se le devuelve con un mensaje de producto creado por el
 *    que el usuario al pueda agregar imagenes a su producto. Ningun otro usuario puede agregar imagenes a un producto que no le pertenece como admin a premium. 
 * 
 * Usuarios:
 *    Mostrar si subio documentos el usuario.
 *    que buscar un usuario lo pueda hacer por id lo pueda hacer cualquiera
 *    que el usuario mismo pueda actualizar sus datos. El admin puede actualizar a todos los usuarios.
 *    un usuario solo puede subir documentos a su propia cuenta.
 *    Si se elimina un usuario que se elimine su producto
 * 
 * Cart:
 *    Solo puede traerse el carrito con el que coincida con el cartId del current. El admin puede obtener cualquiera.
 *    Solo se puede agregar productos al carrito que coincida con su cartId.
 *    Solo se puede eliminar productos del carrito que coincida con su id.
 *    Solo se puede actualizar productos del carrito que coincida con su id.
 * 
*/


 
