import RequiredInputSymbol from '../../../../utils/RequiredInputSymbol';
import { PiWarningLight } from 'react-icons/pi';
import UploadProductImage from './UploadProductImage';
import Input from '../../Input';
import { useCreateUpdateProductContext } from '../context/useCreateUpdateProductContext';
import Spinner from '../../../../utils/Spinner';
import { CreateUpdateProductModalProps } from '../CreateUpdateProductModal';

const DESCRIPTION_SIZE = 5;

type ThisProps = Pick<
  CreateUpdateProductModalProps,
  'modalTitle' | 'allInputsDisabled' | 'formSubmitBtnText'
>;

const ProductForm = ({ modalTitle, allInputsDisabled, formSubmitBtnText }: ThisProps) => {
  const {
    imageURL,
    handleFormSubmit,
    haveErrors,
    isTitleFieldError,
    titleFieldErrorMsg,
    title,
    isPriceFieldError,
    priceFieldErrorMsg,
    price,
    description,
    descriptionFieldErrorMsg,
    isDescriptionFieldError,
    handleFormValuesChange,
  } = useCreateUpdateProductContext();

  return (
    <div className='px-10 pb-10 pt-4'>
      <h3 className='text-xl font-semibold'>{modalTitle.trim()}</h3>
      <form encType='multipart/form-data' onSubmit={handleFormSubmit}>
        <p className='text-gray-500 text-sm mt-6 mb-8'>
          <RequiredInputSymbol /> Indicates required fields.
        </p>
        {/* ----------- error msg if having errors --------- */}
        {haveErrors && (
          <div className='flex items-center gap-x-2 mb-6 text-red-500 bg-red-200 text-base px-4 py-2 rounded-lg'>
            <p className='text-lg'>
              <PiWarningLight />
            </p>
            <p>Please enter the data in a valid format.</p>
          </div>
        )}
        {/* ----------- form controls ----------------------------- */}
        <div className='max-h-[400px] overflow-y-auto overflow-x-visible flex flex-col gap-y-6 px-2 py-4'>
          {/* ------------- upload image ---------------- */}
          <div>
            <UploadProductImage initialImgURL={imageURL ?? ''} />
          </div>
          {/* --------- new title ------------- */}
          <Input
            labelText='Title'
            htmlFor='title'
            isInputError={isTitleFieldError}
            errorMsg={titleFieldErrorMsg}
            disabled={allInputsDisabled}
            type='text'
            id='title'
            name='title'
            value={title}
            onChange={handleFormValuesChange}
            placeholder='Product Title'
          />

          {/* --------- price ------------- */}
          <Input
            labelText='Price'
            htmlFor='price'
            isInputError={isPriceFieldError}
            errorMsg={priceFieldErrorMsg}
            disabled={allInputsDisabled}
            type='text'
            id='price'
            name='price'
            value={price}
            onChange={handleFormValuesChange}
          />
          {/* --------- description ------------- */}
          <div className='flex flex-col gap-y-3'>
            <label htmlFor='description'>
              Description
              <RequiredInputSymbol />
            </label>
            <textarea
              disabled={allInputsDisabled}
              placeholder='Describe about your product here.'
              onChange={handleFormValuesChange}
              name='description'
              id='description'
              className='input min-h-[100px] max-h-[260px]'
              value={description}
              rows={DESCRIPTION_SIZE}
              cols={DESCRIPTION_SIZE}
            />
            {isDescriptionFieldError && descriptionFieldErrorMsg && (
              <p className='text-red-500 text-xs'>{descriptionFieldErrorMsg}</p>
            )}
          </div>
        </div>
        {/* ---------- actions -------------------- */}
        <div className='flex justify-end items-center pt-14'>
          <button
            type='submit'
            disabled={allInputsDisabled}
            className='btn bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center gap-x-4'
          >
            {formSubmitBtnText.trim()}
            <Spinner show={allInputsDisabled} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
