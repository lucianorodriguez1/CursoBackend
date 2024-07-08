import { Router } from 'express';
import { products } from '../../controllers/index.js';
import { authorization } from '../../middlewares/authMiddleware.js';
import { passportCall, passportCallOptional } from '../../middlewares/passportMiddleware.js';
import {validateCreate} from '../../validator/product.js'
import { uploader } from '../../utils/multer.js';

const productRouter = Router();

productRouter.get('/', passportCallOptional('jwt'),products.getProducts);
productRouter.post('/', passportCall('jwt'),authorization('admin','premium'), validateCreate,products.createProduct);
productRouter.get('/:pid', products.getProductById);
productRouter.put('/:pid',  passportCall('jwt'),authorization('admin','premium'),products.updateProductById);
productRouter.delete('/:pid',  passportCall('jwt'),authorization('admin','premium'), products.deleteProductById);
productRouter.post('/:pid/products', uploader.array('productImages', 5), products.uploadProductImages);

export default productRouter;
