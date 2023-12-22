import express from 'express';
import { authControllersV1 } from './controllers';
import rateLimit from 'express-rate-limit';
import checkVendorAuthorization from '../../../middlewares/checkVendorAuthorization';
import { validateSigninCredentials } from './middlewares/validateSigninCredentials';
const authRouterV1 = express.Router();

/**
 * Must validate route data input before hitting controllers
 */

const requestLimiter = rateLimit({
  windowMs: 1000 * 60 * 10, // 10 minutes window
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

authRouterV1.use(requestLimiter);

authRouterV1.post('/signin', [validateSigninCredentials], authControllersV1.signinVendor);
authRouterV1.post(
  '/signout',
  [checkVendorAuthorization],
  authControllersV1.signoutVendor
);

export default authRouterV1;
