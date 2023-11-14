import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import createHttpError from 'http-errors';

type UploadConfig =
  | undefined
  | Partial<{
      folder: string;
      use_filename: boolean;
      filename_override: string;
      public_id: string;
      public_id_prefix: string;
    }>;

export const uploadImageFileToCloudinary = async (
  imageFile: Express.Multer.File,
  uploadConfig: UploadConfig = undefined
): Promise<UploadApiResponse> => {
  try {
    const uploadDetails = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: uploadConfig?.folder,
            use_filename: uploadConfig?.use_filename,
            filename_override: uploadConfig?.filename_override,
            public_id: uploadConfig?.public_id,
            public_id_prefix: uploadConfig?.public_id_prefix,
          },
          (error, result) => {
            if (!result || error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        )
        .end(imageFile.buffer);
    });
    return uploadDetails;
  } catch (error) {
    console.log('Error while uploading image to cloudinary, error: ', error);
    throw createHttpError(500, 'Error while uploading image', {
      name: 'CloudinaryError',
    });
  }
};

export default cloudinary;
