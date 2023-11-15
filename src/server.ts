import { config } from 'dotenv';
config();
require('express-async-errors');
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import errorHandler, { INVALID_ROUTE_MSG } from './middlewares/errorHandler';
import productsRouterV1 from './api/v1/products/routes';
import cloudinary from './services/cloudinary/cloudinary';
import vendorRouterV1 from './api/v1/vendors/routes';
import authRouterV1 from './api/v1/auth/routes';

const env = process.env;
const PORT = env.PORT || 3004;
const app = express();

// app middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(helmet());
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

function init() {
  // routes
  app.get('/', (req, res) => {
    return res.json({
      msg: 'Vendor server running',
    });
  });

  app.get('/api', async (_req, res) => {
    return res.json({
      success: true,
      msg: 'Vendor server running',
    });
  });

  app.use('/api/vendor/v1/products', productsRouterV1);
  app.use('/api/vendor/v1/vendors', vendorRouterV1);
  app.use('/api/vendor/v1/auth', authRouterV1);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.all('*', (_req, _res, next) => {
    next(new Error(INVALID_ROUTE_MSG));
  });

  app.use(errorHandler);
}

app.listen(PORT, () => {
  console.log(`Express server running on PORT: ${PORT}`);
  init();
});
