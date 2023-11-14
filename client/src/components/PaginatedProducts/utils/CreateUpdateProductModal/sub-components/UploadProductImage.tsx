import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { LuUpload } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';
import { useCreateUpdateProductContext } from '../context/useCreateUpdateProductContext';

type ThisProps = {
  initialImgURL: string;
};

const UploadProductImage = ({ initialImgURL }: ThisProps) => {
  const { updateFormFields } = useCreateUpdateProductContext();
  const [previewImgURL, setPreviewImgURL] = React.useState(initialImgURL);
  const borderStyle = previewImgURL ? 'border-0' : 'border-[1px]';

  const validateUploadedImg = (file: File) => {
    const { size, type } = file;

    // ✅ image size
    const MB_5 = 5_242_880;
    if (size > MB_5) {
      toast.error('Img exceeds max allowed img size of 5mbs 😵‍💫');
      return false;
    }

    // ✅ img type
    const isFileImgType = type.startsWith('image/');
    if (!isFileImgType) {
      toast.error('Only image type uploads are allowed 🤕');
      return false;
    }
    return true;
  };

  const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const uploadedFiles = e.target.files;
    const haveUploadedFiles = uploadedFiles?.length;
    if (!haveUploadedFiles && !uploadedFiles) {
      toast.error('Nothing uploaded 🫤');
      return;
    }
    const uploadedImgFile = uploadedFiles[0];
    const isFileValid = validateUploadedImg(uploadedImgFile);
    if (!isFileValid) return;
    const previewURL = URL.createObjectURL(uploadedImgFile);
    setPreviewImgURL(previewURL); // local img state

    updateFormFields({
      image: uploadedImgFile,
      imageURL: null,
    });
  };

  const handleRemoveImgBtnClick = () => {
    setPreviewImgURL('');
    updateFormFields({
      image: null,
      imageURL: null,
    });
  };

  useEffect(() => {
    return () => {
      if (previewImgURL) URL.revokeObjectURL(previewImgURL);
    };
  }, [previewImgURL]);

  return (
    <div
      className={`relative ${borderStyle} border-blue-500 rounded-md border-dashed w-32 h-32 flex-center hover:bg-blue-50 overflow-hidden`}
    >
      <input
        accept='image/*'
        name='productImgUpload'
        type='file'
        onChange={handleImgUpload}
        className='absolute top-0 right-0 bottom-0 left-0 opacity-0 hover:cursor-pointer'
      />

      {previewImgURL ? (
        <>
          <button
            className='rounded-full bg-gray-600 hover:bg-gray-500 opacity-60 right-2 top-2 w-5 h-5 absolute flex-center text-red p-1'
            onClick={handleRemoveImgBtnClick}
          >
            <IoClose
              style={{
                color: 'white',
              }}
            />
          </button>
          <img
            src={previewImgURL}
            className='w-full h-full object-cover top-0 right-0 bottom-0 left-0'
            alt='preview-img'
          />
        </>
      ) : (
        <p className='text-center flex items-center justify-center gap-x-2 text-blue-500 text-sm'>
          Upload
          <span className='text-gray-500'>
            <LuUpload />
          </span>
        </p>
      )}
    </div>
  );
};

export default UploadProductImage;
