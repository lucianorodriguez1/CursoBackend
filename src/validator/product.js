import { check } from "express-validator";
import {validateResult} from "../helpers/validateHelper.js"


export const validateCreate = [
  check("title").exists().not().isEmpty(),
  check("description").exists().not().isEmpty(),
  check("code").exists().isNumeric(),
  check("price").exists().isNumeric(),
  check("status").exists(),
  check("stock").exists().isNumeric(),
  check("category").exists().not().isEmpty(),
  check("thumbnail").exists(),
  (req,res,next)=>{
    validateResult(req,res,next);
  }
];
