import { ErrorCodes } from "../utils/errors/enums.js";
import customError from "../utils/errors/CustomError.js";

export default (req, res, next) => {
  res.render("not-available",{})
};
