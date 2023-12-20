import { NextFunction, Request, Response } from 'express';
import { deleteProductSchema } from '../../../../validation-schemas/product/delete';
import { productServices } from '../services';
import { getLoggedInVendorId } from '../../../../middlewares/checkVendorAuthorization';
import createHttpError from 'http-errors';

export const validateDeleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ✅ delete product validation
  const validatedDeletdProduct = await deleteProductSchema.parseAsync({
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
      `[validateDeleteProduct error]: ${errorMessage} on vendor with id: ${vendorId}`
    );
    throw createHttpError(404, errorMessage);
  }

  next();
};
