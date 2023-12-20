import express from 'express';
import { vendorControllersV1 } from './controllers';
import checkVendorAuthorization from '../../../middlewares/checkVendorAuthorization';
import validateToBeRegisteredVendor from './middlewares/validateToBeRegisteredVendor';
const vendorRouterV1 = express.Router();

/**
 * Must validate route data input before hitting controllers
 */

vendorRouterV1.post(
  '/register',
  [validateToBeRegisteredVendor],
  vendorControllersV1.registerVendor
);

vendorRouterV1.use(checkVendorAuthorization);

vendorRouterV1.get('/', vendorControllersV1.getVendor);

export default vendorRouterV1;
