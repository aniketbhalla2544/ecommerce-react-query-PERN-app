import { NextFunction, Request, Response } from 'express';
import { validateWithCreateProductSchema } from '../../../../validation-schemas/product/create';
import { getLoggedInVendorId } from '../../../../middlewares/checkVendorAuthorization';
import { uploadImageFileToCloudinary } from '../../../../services/cloudinary/cloudinary';

export const validateCreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ✅ validating new product input
  const newProduct = {
    title: req.body.title,
    description: req.body.description,
    price: +req.body.price,
    file: req.file,
  };
  const validatedNewProduct = await validateWithCreateProductSchema(newProduct);

  // ✅ handling product image uploading with cloudinary
  const imageFile = req.file as Express.Multer.File;
  const vendorId = getLoggedInVendorId(res); // validated
  const __uploadedImgDetails = await uploadImageFileToCloudinary(imageFile, {
    folder: `users/${vendorId}/products`,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { secure_url, public_id } = __uploadedImgDetails;

  res.locals.validatedNewProduct = validatedNewProduct;
  res.locals.cloudinaryUploadedImgURL = secure_url;
  next();
};
