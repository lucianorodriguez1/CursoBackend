import { check } from "express-validator";
import { validateResult } from "../validateHelper.js";

export const validateCreate = [
  check("title")
    .exists()
    .withMessage("Title is required")
    .not()
    .isEmpty()
    .withMessage("Title cannot be empty"),
  check("description")
    .exists()
    .withMessage("Description is required")
    .not()
    .isEmpty()
    .withMessage("Description cannot be empty"),
  check("code")
    .exists()
    .withMessage("Code is required")
    .isNumeric()
    .withMessage("Code must be a number"),
  check("price")
    .exists()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  check("status").exists().withMessage("Status is required"),
  check("stock")
    .exists()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a number"),
  check("category")
    .exists()
    .withMessage("Category is required")
    .not()
    .isEmpty()
    .withMessage("Category cannot be empty"),
  check("thumbnails").exists().withMessage("Thumbnails is required"),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];
