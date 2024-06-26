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

//Guardar:
/**
 * modificar ruta de mailRouter para probar mandar un email con un enlace.
 * crear controlador restablecerContrasenia en viewController y su ruta en views.routes.
 * cambiar nombre de error en login a credenciales incorrectas en userService
 * hacer la lista de test.
*/

//mejorar
/**
 * enviar por medio de un correo un boton que redireccione a una pagina para restablecer la contrasenia.(el link del correo debe durar 1 hr. si es la misma contrasenia indicar un mensaje 'no se puede colocar la misma contrasenia'. Si el link expiro debe redirigir a una vista que le permita generar nuevamente el correo de restablecimeiento, con una duracion de 1hr)
 * documentar el modulo API DE productos
 * documentar el modulo API de carts
 * desarrollar 3 test(mocha,cai y supertest) para routers de products, cart y sessions
 * Crear un endpoint en el router de usuarios api/users/:uid/documents con el método POST que permita subir uno o múltiples archivos. Utilizar el middleware de Multer para poder recibir los documentos que se carguen y actualizar en el usuario su status para hacer saber que ya subió algún documento en particular.
 * El middleware de multer deberá estar modificado para que pueda guardar en diferentes carpetas los diferentes archivos que se suban. 
 *    Si se sube una imagen de perfil, deberá guardarlo en una carpeta profiles, en caso de recibir la imagen de un producto, deberá guardarlo en una carpeta products, mientras que ahora al cargar un documento, multer los guardará en una carpeta documents.
 * Modificar el endpoint /api/users/premium/:uid   para que sólo actualice al usuario a premium si ya ha cargado los siguientes documentos:
 *    Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
 *    En caso de llamar al endpoint, si no se ha terminado de cargar la documentación, devolver un error indicando que el usuario no ha terminado de procesar su documentación.(Sólo si quiere pasar de user a premium, no al revés)
 * al elimninar un usuario enviar un correo indicandole que se elimino su usuario del sistema por inactividad.
 * en caso de que un producto pertenezca a un usuario premium se le envie un correo que su producto fue eliminado.
 * resolver el metodo getBy de mis daos.
 * poner la ruta views en routes/web
 * cambiar el nombre de archivos dao por mongo, product.dao --> product.mongo
 * cambiar el nombre a docs/products a docs/product. y cart
 *  controlar el error cuando se tarda mucho tiempo al consultar a la base de datos
 * cambiar nombres de archivos con . por mayus, --> product.services a productsServices
 * crear mvc de tickets
 * modificar el dto de cart:
 *    1.solo devolver los carritos al admin. sacar el __v del cart
 *    2. en el metodo get solo devolver el carrito al usuario logueado con sus producto. sacar el __v y el id
 * modificar el addProd de cart.dao.js para no usar las funciones de nodejs y si las de mongodb
 * eliminar PURCHASE DE CART. 
 * crear una entidad TIKCET donde se hacen las operaciones.
 *  hacer dto de producto (user normal, premium y no logueado no devolver owner, status, id. user admin devolver todo menos __v)
 * resolver el problema de crear un campo productsCreados por usuario premium.
 * ver la resouesta de martin sobre los getBy en userRepository, que tengo 3 getBy..
 * en la ruta current devolver el user solo sin las cosas adicionales.
 * resolver el problema del middleware passportCall para que si no se esta logueado me devuelva los productos con los campos definidos en userDto
 * mover funcion de removeEmptyFileds de userServices y productsService a otra capa.
 * borrar las variables declaradas que no uso
 * al hacer login y register mandar la info del usuario necesario para mostrarla en su perfil. evaluar que hacer en dto,etc.
 * mover la funcion deleteInactive a usersServices
 * ver como puedo hacer req.user.campo y no req.user.user.campo
 */


// preguntar a ger en la entrega
/**
 * se puede hacer que los errores en /service esten dentro de un archivo errorServices
 * ejemplos de documentar el codigo en los mismos archivos en el que fue creada la funcionalidad
 */


//probar
/**
 * donde se guardan los loggers de error en produccion
 * get con sort -1 de products
 * funcion deleteInactives de sessionServices
 * las vistas.
 * borrar los datos que hay en la base de datos
 */