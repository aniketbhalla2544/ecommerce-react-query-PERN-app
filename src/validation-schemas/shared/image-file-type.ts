import { z } from 'zod';

export const imageFileTypeSchema = z.custom<File>(
  (val) => {
    if (!(typeof val === 'object') || !val) return false;

    let isValid = true;

    // checking correct file type, dev info: file type is Express.Multer.File
    const allFieldsExist = checkIfAllFieldsExistInObject(
      ['fieldname', 'originalname', 'mimetype', 'buffer'],
      val
    );
    isValid = allFieldsExist;

    // checking if uploaded file is an img
    if (!('mimetype' in val) || !(typeof val.mimetype === 'string')) return false;
    const isUploadedFileImg = val.mimetype.startsWith('image/');
    isValid = isUploadedFileImg;

    return isValid;
  },
  {
    message:
      'image required or invalid uploaded file type, expected file of mime-type image',
  }
);

function checkIfAllFieldsExistInObject<T extends object>(fields: string[], object: T) {
  const objectFields = Object.getOwnPropertyNames(object);
  let allFieldsExist = true;
  for (const field of fields) {
    if (!objectFields.includes(field)) {
      allFieldsExist = false;
      break;
    }
  }
  return allFieldsExist;
}
