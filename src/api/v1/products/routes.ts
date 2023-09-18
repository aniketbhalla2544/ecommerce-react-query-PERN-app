import express from 'express';
const productsRouterV1 = express.Router();
import { productControllersV1 } from './controllers';

productsRouterV1.route('/').get(productControllersV1.getProducts);

export default productsRouterV1;
