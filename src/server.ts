import { config } from 'dotenv';
config();
require('express-async-errors');
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import errorHandler, { INVALID_ROUTE_MSG } from './middlewares/errorHandler';
import cloudinary from './services/cloudinary/cloudinary';
import appRouter from './app.router';
import appConfig from './config/appConfig';

const env = process.env;
const PORT = env.PORT || 3004;
const app = express();

// app middlewares
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(helmet());
cloudinary.config(appConfig.cloudinary);

// routes
app.get('/', async (req, res) => {
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

app.use(appRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.all('*', (_req, _res, next) => {
  next(new Error(INVALID_ROUTE_MSG));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Express server running on PORT: ${PORT}`);
});
