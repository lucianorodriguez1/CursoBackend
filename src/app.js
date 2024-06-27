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
  console.log(`listening to the server on PORT ${config.port}`);
});

//generar documentacion api
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

//Realizar
/**
 * Desafio complementario:
 *    enviar por medio de un correo un boton que redireccione a una pagina para restablecer la contrasenia.(el link del correo debe durar 1 hr. si es la misma contrasenia indicar un mensaje 'no se puede colocar la misma contrasenia'. Si el link expiro debe redirigir a una vista que le permita generar nuevamente el correo de restablecimeiento, con una duracion de 1hr).
 *
 * 
 * Eliminar purchase de los archivos CART y agregarlo a mvc de ticket
 * 
 * La ruta current debe devolver  el user solo sin las cosas adicionales.
 * 
 * Resolver el metodo getBy de mis daos:
 *    user.dao.js --> eliminar dos funciones y hacer una generica
 * 
 *  * Mover funcion de removeEmptyFileds de userServices y productsService a otra capa.
 * 
 * Borrar las variables declaradas de todos los archivos que no uso
 * 
 * Al hacer login y register mandar la info del usuario necesario para mostrarla en su perfil. 
 *      Evaluar que hacer en dto,etc.
 * 
 * agregar permisos para el ticket
 * 
 * Desafio Documentar 2 modulos de mi app:
 *    documentar el modulo API DE productos
 *    documentar el modulo API de carts
 *
 * Desafio Test en 3 modulos:
 *    desarrollar 3 test(mocha,cai y supertest) para routers de products
 *    desarrollar 3 test(mocha,cai y supertest) para routers de carts
 *    desarrollar 3 test(mocha,cai y supertest) para routers de sessions
 *
 * Desafio 4 entrega integradora:
 *    crear un endpoint en el router de usuarios api/users/:uid/documents con el método POST que permita subir uno o múltiples archivos. Utilizar el middleware de Multer para poder recibir los documentos que se carguen y actualizar en el usuario su status para hacer saber que ya subió algún documento en particular.
 *    El middleware de multer deberá estar modificado para que pueda guardar en diferentes carpetas los diferentes archivos que se suban.
 *    Si se sube una imagen de perfil, deberá guardarlo en una carpeta profiles, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products, mientras que ahora al cargar un documento, multer los guardará en una carpeta documents.
 * Modificar el endpoint /api/users/premium/:uid   para que sólo actualice al usuario a premium si ya ha cargado los siguientes documentos:
 *    Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
 *    En caso de llamar al endpoint, si no se ha terminado de cargar la documentación, devolver un error indicando que el usuario no ha terminado de procesar su documentación.(Sólo si quiere pasar de user a premium, no al revés)
 *
 * Desafio entrega final:
 * al elimninar un usuario enviar un correo indicandole que se elimino su usuario del sistema por inactividad.
 * en caso de que un producto pertenezca a un usuario premium se le envie un correo que su producto fue eliminado.
 * mejorar respuestas de validacion al crear usuareios y tener los campos vacios.
 */


// Consultas:
/**
 * se puede hacer que los errores en /service esten dentro de un archivo errorServices.
 * 
 * ejemplos de documentar el codigo en los mismos archivos en el que fue creada la funcionalidad.
 * 
 * tengo una pregunta para un escenario en especifico. Si yo tengo a dos tipos de user, ‘normal’ y ‘premium’, pero al ser premium quiero que tenga un dato de “productosCreados” que representa un array con productos creados, y es una funcionalidad solo para users ‘premium’. ¿Como hago esto si un user normal no tiene que tener ese campo xq sino ocuparia espacio en la base de datos si a todos los users le pongo productosCreados = null?
 */

//Probar:
/**
 * donde se guardan los loggers de error en produccion
 * 
 * get con sort -1 de products
 * 
 * funcion deleteInactives de sessionServices
 * 
 * las vistas.
 * 
 * borrar los datos que hay en la base de datos
 * 
 * como puedo hacer req.user.campo y no req.user.user.campo
 * 
 * Ver porque me da el error de ruta cuando hago un get de las rutas de views.
 * 
 * mvc de ticket
 * 
 * Poner la ruta views en routes/web y crear su index
 * 
 * Mejorar la eficiencia del addProd de cart.dao.js
 */



