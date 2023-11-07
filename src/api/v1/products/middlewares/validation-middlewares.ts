import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateGetProducts = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export const validateProductId = (req: Request, res: Response, next: NextFunction) => {
  const productId = Number(req.params.id.trim());

  // ✅ validating productId
  const ProductIdValidationSchema = z
    .number({
      required_error: 'productId is required',
      invalid_type_error: 'productId must be a number',
    })
    .positive({
      message: 'productId must be a positive number',
    });
  ProductIdValidationSchema.parse(productId);

  next();
};
