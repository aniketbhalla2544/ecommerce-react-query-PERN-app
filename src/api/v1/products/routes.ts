import express from 'express';
const productsRouterV1 = express.Router();
import { productControllersV1 } from './controllers';
import multerUpload from '../../../services/multer';
import checkVendorAuthorization from '../../../middlewares/checkVendorAuthorization';
import { validateCreateProduct } from './middlewares/validateCreateProduct';
import { validateDeleteProduct } from './middlewares/validateDeleteProduct';
import { validateGetProduct } from './middlewares/validateGetProduct';
import { validateGetAllProducts } from './middlewares/validateGetAllProducts';
import { validateUpdateProduct } from './middlewares/validateUpdateProduct';

/**
 * Must validate route data input before hitting controllers
 */

const CREATE_PRODUCT_IMAGE_NAME = 'image'; // should be same as being sent in FormData by frontend code

productsRouterV1.use(checkVendorAuthorization);

productsRouterV1.get('/', [validateGetAllProducts], productControllersV1.getProducts);
productsRouterV1.get('/:id', [validateGetProduct], productControllersV1.getProduct);
productsRouterV1.post(
  '/',
  [multerUpload.single(CREATE_PRODUCT_IMAGE_NAME), validateCreateProduct],
  productControllersV1.createProduct
);
productsRouterV1.delete(
  '/:id',
  [validateDeleteProduct],
  productControllersV1.deleteProduct
);
productsRouterV1.put(
  '/:id',
  [multerUpload.single(CREATE_PRODUCT_IMAGE_NAME), validateUpdateProduct],
  productControllersV1.updateProduct
);

export default productsRouterV1;
