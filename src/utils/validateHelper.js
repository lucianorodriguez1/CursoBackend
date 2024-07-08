import { validationResult } from "express-validator";

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = new Set(errors.array().map(err => err.msg));
    req.logger.error(Array.from(errorMessages).join(", "));
    return res.status(400).json({ errors: Array.from(errorMessages) });
  }
  next();
};
