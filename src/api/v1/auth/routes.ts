import express from 'express';
import { authControllersV1 } from './controllers';
import rateLimit from 'express-rate-limit';
const authRouterV1 = express.Router();

const requestLimiter = rateLimit({
  windowMs: 1000 * 60 * 10, // 10 minutes window
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

authRouterV1.use(requestLimiter);

authRouterV1.post('/signin', authControllersV1.signinVendor);
authRouterV1.post('/logout', authControllersV1.signoutVendor);

export default authRouterV1;
