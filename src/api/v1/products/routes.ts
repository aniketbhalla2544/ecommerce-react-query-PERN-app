import express from 'express';
const productsRouterV1 = express.Router();
import { productControllersV1 } from './controllers';
import { validateProductId } from './middlewares/validation-middlewares';

productsRouterV1.get('/', productControllersV1.getProducts);
productsRouterV1.get('/:id', validateProductId, productControllersV1.getProduct);
productsRouterV1.post('/', productControllersV1.createProduct);
productsRouterV1.delete('/:id', validateProductId, productControllersV1.deleteProduct);
productsRouterV1.patch('/:id', validateProductId, productControllersV1.updateProduct);

export default productsRouterV1;
