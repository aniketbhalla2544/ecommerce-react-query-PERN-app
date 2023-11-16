import express from 'express';
import { authControllersV1 } from './controllers';
const authRouterV1 = express.Router();

authRouterV1.post('/signin', authControllersV1.signinVendor);

export default authRouterV1;
