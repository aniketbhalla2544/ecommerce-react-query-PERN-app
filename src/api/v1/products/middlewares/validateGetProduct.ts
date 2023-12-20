import { NextFunction, Request, Response } from 'express';
import { productServices } from '../services';
import { getLoggedInVendorId } from '../../../../middlewares/checkVendorAuthorization';
import createHttpError from 'http-errors';
import { getProductSchema } from '../../../../validation-schemas/product/get-product';

export const validateGetProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ✅ delete product validation
  const validatedDeletdProduct = await getProductSchema.parseAsync({
    id: +req.params.id.trim(),
  });
  const { id: productId } = validatedDeletdProduct;

  // check for existing product
  const vendorId = getLoggedInVendorId(res);
  const product = await productServices.getProductById({
    productId,
    vendorId,
  });
  if (!product) {
    const errorMessage = `product with id: ${productId} not found`;
    console.log(
      `[validateGetProduct error]: ${errorMessage} on vendor with id: ${vendorId}`
    );
    throw createHttpError(404, errorMessage);
  }

  next();
};
