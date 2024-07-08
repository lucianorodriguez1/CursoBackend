import purchaseService from "../services/PurchaseService.js";
import { response } from "../utils/response.js";

export const createPurchase = async(req,res) => {
    const cartId = req.params.cid
    const cartCurrent = req.user?.data?.cartId || null;
    const result = await purchaseService.createPurchase(cartId,cartCurrent);
    response(res, 200, result);
}