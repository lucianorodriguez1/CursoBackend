import { ErrorCodes } from "../utils/errors/enums.js";
import customError from "../utils/errors/CustomError.js";

export default (req, res, next) => {
  customError.createError({
    name: "Route not found",
    cause:"the route was entered incorrectly ruta",
    message: "route not exists",
    code: ErrorCodes.ROUTING_ERROR
  });
};
