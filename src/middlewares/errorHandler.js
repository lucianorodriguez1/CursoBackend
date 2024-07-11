import { ErrorCodes } from "../services/errors/enums.js";

export default (error, req, res, next) => {
  switch (error.code) {
    case ErrorCodes.INVALID_TYPES_ERROR:
    case ErrorCodes.DUPLICATE_EMAIL:
    case ErrorCodes.DUPLICATE_CODE:
    case ErrorCodes.NOT_PERMISSION_DELETE_PRODUCT:
    case ErrorCodes.ROUTING_ERROR:
    case ErrorCodes.NOT_PERMISSION_GET_CART:
    case ErrorCodes.NOT_AVAILABLE_ADDPRODUCTCART:
    case ErrorCodes.INVALID_TOKEN:
    case ErrorCodes.TOKEN_EXPIRED:
      res.status(400).json({ error: false, name: error.name });
      break;
    case ErrorCodes.INVALID_ID:
    case ErrorCodes.INVALID_EMAIL:
    case ErrorCodes.NOT_FOUND_ERROR:
    case ErrorCodes.REPEATED_PASSWORD:
    case ErrorCodes.PRODUCT_NOT_FOUND__IN_CART:
      res.status(404).json({ error: false, name: error.name });
      break;
    case ErrorCodes.VALIDATION_ERROR:
      res.status(422).json({ error: false, name: error.name });
      break;
    case ErrorCodes.AUTHENTICATION_ERROR:
      res.status(401).json({ error: false, name: error.name });
      break;
    case ErrorCodes.AUTHORIZATION_ERROR:
      res.status(403).json({ error: false, name: error.name });
      break;
    case ErrorCodes.DATABASE_ERROR:
    case ErrorCodes.TOKEN_ERROR:
      req.logger.error(`Mensaje de error:
        ${error.message}\n\n
        Stack Trace: ${error.stack}`);
      res.status(500).json({ error: true, error: error.name });
      break;
    default:
      req.logger.error(`Mensaje de error:
        ${error.message}\n\n
        Stack Trace: ${error.stack}`);
      res.status(500).json({
        error: true,
        mssage: "Unhaled error",
      });
      break;
  }
};
