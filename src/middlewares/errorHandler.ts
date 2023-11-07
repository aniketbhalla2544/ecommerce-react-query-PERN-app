// import { apploggers } from 'services/logger.services';
import { isHttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

const DEFAULT_ERROR_NAME = 'Internal Server Error';
export const INVALID_ROUTE_MSG = 'Request to invalid route';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  // ✔️ catching 'http-errors' package generated errors
  if (isHttpError(err)) {
    const exposedToClient = err.expose;
    if (exposedToClient) {
      const status = err.statusCode ?? err.status ?? 500;
      const message = err.message;
      const name = err.name ?? DEFAULT_ERROR_NAME;
      const httpError = {
        ...err,
        success: false,
        message,
        name,
        status,
      };
      console.log(httpError);
      // apploggers.jsonLogger.error(httpError);
      return res.status(status).json(httpError);
    }
  }

  // ✔️ catching zod validation errors
  if (err instanceof ZodError) {
    const issues = err.issues;
    const validationErrorMessages = [];
    for (const issue of issues) {
      validationErrorMessages.push(issue.message);
    }
    const errorResponse = {
      status: 400,
      success: false,
      name: 'Validation Error',
      validationErrorMessages,
    };
    console.log(errorResponse);
    return res.status(400).json(errorResponse);
  }

  // ✔️ catching invalid route request error
  if (err instanceof Error) {
    if (err.message === INVALID_ROUTE_MSG) {
      const invalidRouteRequestError = {
        status: 400,
        name: DEFAULT_ERROR_NAME,
        msg: INVALID_ROUTE_MSG,
        requestedPath: req.originalUrl,
      };
      console.log(invalidRouteRequestError);
      // apploggers.jsonLogger.error(invalidRouteRequestError);
      return res.status(400).json(invalidRouteRequestError);
    }
  }

  // ✔️ catching general errors
  const generalErrorMsg = err instanceof Error ? err.message : 'Something went wrong';
  const error = {
    success: false,
    status: 500,
    name: DEFAULT_ERROR_NAME,
    msg: generalErrorMsg,
  };
  console.log(error);
  // apploggers.jsonLogger.error(error);
  return res.status(500).json(error);
};

export default errorHandler;
