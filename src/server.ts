import { config } from 'dotenv';
config();
import 'express-async-errors';
import 'module-alias/register';
import express from 'express';
import errorHandler, { INVALID_ROUTE_MSG } from '@/middlewares/errorHandler';
import { apploggers } from '@/services/logger.services';
import productsRouterV1 from '@/api/v1/products/routes';
const PORT = 3003 || process.env.PORT;
// import logger from 'pino-http';

const app = express();

// app middlewares
app.use(express.json());
app.use((req, res, next) => {
  apploggers.jsonLogger.info(`Requested route: ${req.originalUrl}`);
  next();
});

// routes
app.get('/api', async (_req, res) => {
  return res.send('Dyno Ecommerce server working');
});

app.use('/api/products', productsRouterV1);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.all('*', (_req, _res, next) => {
  next(new Error(INVALID_ROUTE_MSG));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Express server running on PORT: ${PORT}`);
});
