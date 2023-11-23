import { NextFunction, Request, Response } from 'express';
import { uploadImageFileToCloudinary } from '../../../../services/cloudinary/cloudinary';
import { getLoggedInVendorId } from '../../../../middlewares/checkVendorAuthorization';

const cloudinaryImgUpladHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = getLoggedInVendorId(res);
  const imageFile = req.file || null;

  // handling image upload if file found
  if (imageFile) {
    const __uploadedImgDetails = await uploadImageFileToCloudinary(imageFile, {
      folder: `users/${vendorId}/products`,
    });
    const { secure_url, public_id } = __uploadedImgDetails;

    const uploadedImgDetails = {
      secure_url,
      public_id,
    };
    res.locals.uploadedImgDetails = uploadedImgDetails;
  }
  next();
};

export default cloudinaryImgUpladHandler;
