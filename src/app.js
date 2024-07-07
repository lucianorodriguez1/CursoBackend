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
 * instalar el paquete mocha en desarrollo: 'npm i -D mocha'.
*/

//MEJORAR:
/**
 * TODO
 * en los archivos routes verificar devolver las respuestas de acuerdo a QUIEN ES. (MIRAR TODOS LOS ROUTES)
 * 
 * USUARIOS
 * funcion deleteInactives de sessionServices (borrar usuarios por inactividad y mandarles un correo)
 * Si se sube una imagen de perfil, deberá guardarlo en una carpeta profiles, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products, mientras que ahora al cargar un documento, multer los guardará en una carpeta documents.
 * Modificar el endpoint /api/users/premium/:uid   para que sólo actualice al usuario a premium si ya ha cargado los siguientes documentos:
 *    Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
 *    En caso de llamar al endpoint, si no se ha terminado de cargar la documentación, devolver un error indicando que el usuario no ha terminado de procesar su documentación.(Sólo si quiere pasar de user a premium, no al revés)
 * arreglar github en passport
 * 
 * 
 * DESAFIO TESTING
 *    desarrollar 3 test(mocha,cai y supertest) para routers de products
 *    desarrollar 3 test(mocha,cai y supertest) para routers de carts
 *    desarrollar 3 test(mocha,cai y supertest) para routers de sessions
 * 
*/
