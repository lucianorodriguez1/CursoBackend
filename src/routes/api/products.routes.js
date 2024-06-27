import { Router } from 'express';

import { products } from '../../controllers/index.js';
import { authorization } from '../../middlewares/authMiddleware.js';
import { passportCall } from '../../middlewares/passportMiddleware.js';
import {validateCreate} from '../../validator/product.js'

const productRouter = Router();

productRouter.get('/', products.getProducts);
productRouter.post('/', passportCall('jwt'),authorization('admin','premium'), validateCreate,products.createProduct);
productRouter.get('/:pid', products.getProductById);
productRouter.put('/:pid',  passportCall('jwt'),authorization('admin'),products.updateProductById);
productRouter.delete('/:pid',  passportCall('jwt'),authorization('admin','premium'), products.deleteProductById);

export default productRouter;
