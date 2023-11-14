import { NextFunction, Request, Response } from 'express';
import { uploadImageFileToCloudinary } from '../../../../services/cloudinary';
import { USER_ID } from '../../../../db';

const cloudinaryImgUpladHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imageFile = req.file || null;
  const userId = USER_ID;

  // handling image upload if file found
  if (imageFile) {
    const __uploadedImgDetails = await uploadImageFileToCloudinary(imageFile, {
      folder: `users/${userId}/products`,
    });
    const { secure_url, public_id } = __uploadedImgDetails;

    const uploadedImgDetails = {
      secure_url,
      public_id,
    };
    console.log(uploadedImgDetails);
    res.locals.uploadedImgDetails = uploadedImgDetails;
  }
  next();
};

export default cloudinaryImgUpladHandler;
