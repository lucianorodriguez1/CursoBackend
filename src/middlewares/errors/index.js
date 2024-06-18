import { ErrorCodes } from "../../services/errors/enums.js";

export default (error, req, res, next) => {
  req.logger.info(error.cause)
  switch (error.code) {
    case ErrorCodes.ROUTING_ERROR:
      res.status(400).json({ status: "error", error: error.name });
      break;
    case ErrorCodes.INVALID_TYPES_ERROR:
      res.status(400).json({ status: "error", error: "campos incompletos" });
      break;
    //bloque prueba
    case ErrorCodes.VALIDATION_ERROR:
      res.status(422).json({ status: "error", error: error.name });
      break;
    case ErrorCodes.AUTHENTICATION_ERROR:
      res.status(401).json({ status: "error", error: error.name });
      break;

    case ErrorCodes.AUTHORIZATION_ERROR:
      res.status(403).json({ status: "error", error: error.name });
      break;

    case ErrorCodes.NOT_FOUND_ERROR:
      res.status(404).json({ status: "error", error: error.name });
      break;
    case ErrorCodes.DATABASE_ERROR:
      res.status(500).json({ status: "error", error: "Database error" });
      break;
    case ErrorCodes.PAYMENT_ERROR:
      res.status(402).json({ status: "error", error: "Payment error"});
      break;
    case ErrorCodes.INVENTORY_ERROR:
      res.status(409).json({ status: "error", error: "Inventory error"});
      break;
    case ErrorCodes.SHIPPING_ERROR:
      res.status(502).json({ status: "error", error: "Shipping error"});
      break;
    case ErrorCodes.RATE_LIMITING_ERROR:
      res.status(429).json({ status: "error", error: "Too many requests"});
      break;
    //fin bloque prueba
    default:
      res.status(500).json({ status: "error", error: "Unhaled error",message: error.message}); //probar message
      break;
  }
};
