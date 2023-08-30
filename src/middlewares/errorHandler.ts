import { isHttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { apploggers } from '@/services/logger.services';

const DEFAULT_ERROR_NAME = 'Internal Server Error';
export const INVALID_ROUTE_MSG = 'Request to invalid route';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  // errors created with 'http-errors' package
  if (isHttpError(err)) {
    const exposedToClient = err.expose;
    if (exposedToClient) {
      const status = err.statusCode ?? err.status ?? 500;
      const msg = err.message;
      const name = err.name ?? DEFAULT_ERROR_NAME;
      const httpError = {
        success: false,
        name,
        msg,
      };
      apploggers.jsonLogger.error(httpError);
      return res.status(status).json(httpError);
    }
  }

  // for invalid route request
  if (err instanceof Error) {
    if (err.message === INVALID_ROUTE_MSG) {
      const invalidRouteRequestError = {
        name: DEFAULT_ERROR_NAME,
        msg: INVALID_ROUTE_MSG,
        requestedPath: req.originalUrl,
      };
      apploggers.jsonLogger.error(invalidRouteRequestError);
      return res.status(404).json(invalidRouteRequestError);
    }
  }

  // general error
  const error = {
    success: false,
    name: DEFAULT_ERROR_NAME,
    msg: 'Something went wrong',
  };
  apploggers.jsonLogger.error(error);
  return res.status(500).json(error);
};

export default errorHandler;
