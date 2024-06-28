import purchaseService from "../services/UserService.js";
import { response } from "../utils/response.js";

export const createPurchase = async(req,res) => {
    const result = await purchaseService.createPurchase();
    response(res, 200, result);
}