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

const PORT = process.env.PORT || 3003;
const app = express();

// app middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(helmet());

// routes
app.get('/', (req, res) => {
  return res.json({
    msg: 'Dyno Expresss server running from Docker Container',
  });
});

app.get('/api', async (_req, res) => {
  return res.json({
    success: true,
    msg: 'server running',
  });
});

app.use('/api/v1/products', productsRouterV1);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.all('*', (_req, _res, next) => {
  next(new Error(INVALID_ROUTE_MSG));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Express server running on PORT: ${PORT}`);
});
