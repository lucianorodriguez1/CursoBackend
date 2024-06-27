import { ErrorCodes } from "../services/errors/enums.js";

export default (error, req, res, next) => {
  req.logger.error(`${error}`);
  switch (error.code) {
    case ErrorCodes.INVALID_TYPES_ERROR:
      res.status(400).json({ error: true, name: error.name });
      break;
    case ErrorCodes.INVALID_ID:
      res.status(404).json({ error: true, name: error.name });
      break;
    case ErrorCodes.INVALID_EMAIL:
      res.status(404).json({ error: true, name: error.name });
      break;
    case ErrorCodes.VALIDATION_ERROR:
      res.status(422).json({ error: true, name: error.name });
      break;
    case ErrorCodes.DUPLICATE_CODE:
      res.status(400).json({ error: true, name: error.name });
      break;
    case ErrorCodes.DUPLICATE_EMAIL:
      res.status(400).json({ error: true, name: error.name });
      break;
    case ErrorCodes.AUTHENTICATION_ERROR:
      res.status(401).json({ error: true, name: error.name });
      break;
    case ErrorCodes.AUTHORIZATION_ERROR:
      res.status(403).json({ error: true, name: error.name });
      break;
    case ErrorCodes.NOT_FOUND_ERROR:
      res.status(404).json({ error: true, name: error.name });
      break;
    case ErrorCodes.ROUTING_ERROR:
      res.status(400).json({ error: true, name: error.name });
      break;
    case ErrorCodes.NOT_PERMISSION_DELETE_PRODUCT:
      res.status(400).json({ error: true, name: error.name });
      break;
    case ErrorCodes.NOT_AVAILABLE_ADDPRODUCTCART:
      res.status(400).json({ error: true, name: error.name });
      break;
    case ErrorCodes.DATABASE_ERROR:
      res.status(500).json({ error: true, error: error.name });
      break;
    case ErrorCodes.NOT_PERMISSION_GET_CART:
      res.status(400).json({ error: true, name: error.name });
      break;
    case ErrorCodes.INVALID_TOKEN:
      res.status(400).json({ error: true, name: error.name });
      break;
    case ErrorCodes.TOKEN_EXPIRED:
      res.status(400).json({ error: true, name: error.name });
      break;
    case ErrorCodes.TOKEN_ERROR:
      res.status(500).json({ error: true, name: error.name });
      break;
      case ErrorCodes.REPEATED_PASSWORD:
      res.status(404).json({ error: true, name: error.name });
      break;
    default:
      res.status(500).json({
        error: true,
        error: "Unhaled error",
        message: error.message,
      });
      break;
  }
};
