import express from 'express';
import { vendorControllersV1 } from './controllers';
import validateRegisteredVendor from './middlewares/validateRegisteredVendor';
const vendorRouterV1 = express.Router();

vendorRouterV1.post(
  '/register',
  [validateRegisteredVendor],
  vendorControllersV1.registerVendor
);

export default vendorRouterV1;
