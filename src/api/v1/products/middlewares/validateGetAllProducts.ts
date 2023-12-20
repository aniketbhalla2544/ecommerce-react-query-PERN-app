import { NextFunction, Request, Response } from 'express';
import { getAllProductsSchema } from '../../../../validation-schemas/product/get-all-products';

export const validateGetAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = req.query.page as string | undefined;
  const limit = req.query.limit as string | undefined;

  // ✅ delete product validation
  const validatedGetAllProducts = await getAllProductsSchema.parseAsync({
    page: page && +page,
    limit: limit && +limit,
  });

  res.locals.validatedGetAllProducts = validatedGetAllProducts;
  next();
};
