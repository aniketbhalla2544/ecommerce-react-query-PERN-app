import express from 'express';
import { authControllersV1 } from './controllers';
import rateLimit from 'express-rate-limit';
const authRouterV1 = express.Router();

const limiter = rateLimit({
  windowMs: 1000 * 60 * 10, // 10 minutes window
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

authRouterV1.post('/signin', [limiter], authControllersV1.signinVendor);

export default authRouterV1;
