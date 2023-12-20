import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export const validateWithZodSchema =
  (zodSchema: AnyZodObject, data: unknown) =>
  async (req: Request, res: Response, next: NextFunction) => {
    await zodSchema.parseAsync(data);
    next();
  };
