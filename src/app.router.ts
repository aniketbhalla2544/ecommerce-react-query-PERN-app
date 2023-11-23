import express from 'express';
import productsRouterV1 from './api/v1/products/routes';
import vendorRouterV1 from './api/v1/vendors/routes';
import authRouterV1 from './api/v1/auth/routes';
const appRouter = express.Router();

appRouter.use('/api/vendor/v1/auth', authRouterV1);
appRouter.use('/api/vendor/v1/products', productsRouterV1);
appRouter.use('/api/vendor/v1/vendors', vendorRouterV1);

export default appRouter;
