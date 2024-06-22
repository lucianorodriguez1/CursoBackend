import { ErrorCodes } from "../services/errors/enums.js";

export default (error, req, res, next) => {
  req.logger.error(`${error}`);
  switch (error.code) {
   
    case ErrorCodes.INVALID_TYPES_ERROR:
      res.status(400).json({ error: true, name:error.name });
      break;
    case ErrorCodes.INVALID_ID:
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
      break
    case ErrorCodes.AUTHENTICATION_ERROR:
      res.status(401).json({ error: true, name: error.name });
      break;

    case ErrorCodes.AUTHORIZATION_ERROR:
      res.status(403).json({ error: true, name: error.name });
      break;

    case ErrorCodes.NOT_FOUND_ERROR:
      res.status(404).json({ error: true, name: error.name });
      break;
      /*
      case ErrorCodes.ROUTING_ERROR:
        res.status(400).json({ error: true, name: error.name });
        break;
    case ErrorCodes.DATABASE_ERROR:
      res.status(500).json({ error: true, error: "Database error" });
      break;
    case ErrorCodes.PAYMENT_ERROR:
      res.status(402).json({ error: true, error: "Payment error" });
      break;
    case ErrorCodes.INVENTORY_ERROR:
      res.status(409).json({ error: true, error: "Inventory error" });
      break;
    case ErrorCodes.SHIPPING_ERROR:
      res.status(502).json({ error: true, error: "Shipping error" });
      break;
    case ErrorCodes.RATE_LIMITING_ERROR:
      res.status(429).json({ error: true, error: "Too many requests" });
      break;
      */
    default:
      res.status(500).json({
        error: true,
        error: "Unhaled error",
        message: error.message,
      });
      break;
  }
};
