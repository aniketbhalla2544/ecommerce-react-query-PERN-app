import express from 'express';
import { vendorControllersV1 } from './controllers';
import validateRegisteredVendor from './middlewares/validateRegisteredVendor';
import checkVendorAuthorization from '../../../middlewares/checkVendorAuthorization';
const vendorRouterV1 = express.Router();

vendorRouterV1.post(
  '/register',
  [validateRegisteredVendor],
  vendorControllersV1.registerVendor
);

vendorRouterV1.use(checkVendorAuthorization);

vendorRouterV1.get('/', vendorControllersV1.getVendor);
vendorRouterV1.post('/update', vendorControllersV1.updateVendor);
vendorRouterV1.post('/delete', vendorControllersV1.deleteVendor);

export default vendorRouterV1;
