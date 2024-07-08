// middlewares/notFound.js
import { ErrorCodes } from "../services/errors/enums.js";
import customError from "../services/errors/CustomError.js";

export default (req, res, next) => {
  customError.createError({
    name: "ruta no encontrada",
    cause:"se introdujo mal la ruta",
    message: "La ruta introducida no existe",
    code: ErrorCodes.ROUTING_ERROR
  });
};
