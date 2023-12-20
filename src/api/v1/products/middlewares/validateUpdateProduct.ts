import { NextFunction, Request, Response } from 'express';
import { productServices } from '../services';
import { getLoggedInVendorId } from '../../../../middlewares/checkVendorAuthorization';
import createHttpError from 'http-errors';
import { validateWithUpdateProductSchema } from '../../../../validation-schemas/product/update';
import { uploadImageFileToCloudinary } from '../../../../services/cloudinary/cloudinary';
import { removeUndefinedProps } from '../../../../utils/helpers';

export const validateUpdateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ✅ validate update product data
  const updateProductData = {
    id: +req.params.id.trim(),
    title: req.body.title,
    description: req.body.description,
    price: 'price' in req.body ? +req.body.price : undefined,
    file: req.file,
  };
  const validatedProduct = await validateWithUpdateProductSchema(updateProductData);
  const vendorId = getLoggedInVendorId(res);

  // ✅ checking if product exists
  const validatedProductId = validatedProduct.id;
  const product = await productServices.getProductById({
    productId: validatedProductId,
    vendorId,
  });
  if (!product) {
    console.log(
      `[validateUpdateProduct error]: product update operation failed because product with id: ${validatedProductId} doesnot exists on vendor with id: ${vendorId}`
    );
    throw createHttpError(404, 'product doesnot exists', {
      productId: validatedProductId,
    });
  }

  // ✅ handling product image uploading with cloudinary
  if (validatedProduct.file) {
    const imageFile = req.file as Express.Multer.File;
    const __uploadedImgDetails = await uploadImageFileToCloudinary(imageFile, {
      folder: `users/${vendorId}/products`,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { secure_url, public_id } = __uploadedImgDetails;
    res.locals.cloudinaryUploadedProductImgURL = secure_url;
  }

  const validatedUpdateProduct = removeUndefinedProps(validatedProduct);
  res.locals.validatedUpdateProduct = validatedUpdateProduct;
  next();
};
