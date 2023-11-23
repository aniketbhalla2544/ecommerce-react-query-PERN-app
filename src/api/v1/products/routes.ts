import express from 'express';
const productsRouterV1 = express.Router();
import { productControllersV1 } from './controllers';
import { validateProductId } from './middlewares/validation-middlewares';
import multerUpload from '../../../services/multer';
import cloudinaryImgUpladHandler from './middlewares/cloudinaryImgUpladHandler';
import checkVendorAuthorization from '../../../middlewares/checkVendorAuthorization';

const CREATE_PRODUCT_IMAGE_NAME = 'image'; // should be same as being sent in FormData by frontend code

productsRouterV1.use(checkVendorAuthorization);

productsRouterV1.get('/', productControllersV1.getProducts);
productsRouterV1.get('/:id', validateProductId, productControllersV1.getProduct);
productsRouterV1.post(
  '/',
  [multerUpload.single(CREATE_PRODUCT_IMAGE_NAME), cloudinaryImgUpladHandler],
  productControllersV1.createProduct
);
productsRouterV1.delete('/:id', validateProductId, productControllersV1.deleteProduct);
productsRouterV1.put(
  '/:id',
  [
    validateProductId,
    multerUpload.single(CREATE_PRODUCT_IMAGE_NAME),
    cloudinaryImgUpladHandler,
  ],
  productControllersV1.updateProduct
);

export default productsRouterV1;
