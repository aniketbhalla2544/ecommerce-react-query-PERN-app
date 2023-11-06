import React from 'react';
import { FiX } from 'react-icons/fi';
import Modal from '../../utils/Modal';
import toast from 'react-hot-toast';
import { z, ZodError } from 'zod';
import RequiredInputSymbol from '../../utils/RequiredInputSymbol';
import { FieldsObject, UknownObject } from '../../../types/general';
import Spinner from '../../utils/Spinner';
import { PiWarningLight } from 'react-icons/pi';
import { ProductWithNoProductId } from '../../../types/products';

const DESCRIPTION_SIZE = 5;
const MAX_PRICE = 1_00_000;

type FormStateFields = {
  title: string;
  description: string;
  price: number;
  image: null | string;
};

type StringTypeFormStateFields = Partial<FieldsObject<FormStateFields>>;

type FormState = FormStateFields & {
  errors: null | StringTypeFormStateFields;
};

type ThisProps = {
  initialProductDetails?: FormStateFields;
  onFormSubmittion: (product: ProductWithNoProductId) => Promise<void>;
  allInputsDisabled: boolean;
  showModal: boolean;
  onClose: () => void;
};

const CreateUpdateProductModal = ({
  allInputsDisabled,
  initialProductDetails,
  onFormSubmittion,
  onClose,
  showModal,
}: ThisProps) => {
  const initialFormState: FormState = {
    title: initialProductDetails?.title ?? '',
    description: initialProductDetails?.description ?? '',
    price: initialProductDetails?.price ?? 0,
    image: initialProductDetails?.image ?? null,
    errors: null,
  };
  const [formState, setFormState] = React.useState(initialFormState); // ✅
  const { title, description, price, errors } = formState; // ✅
  const isTitleFieldError = !!errors && 'title' in errors; // ✅
  const titleFieldErrorMsg = errors?.title ?? ''; // ✅
  const isDescriptionFieldError = !!errors && 'description' in errors; // ✅
  const descriptionFieldErrorMsg = errors?.description ?? ''; // ✅
  const isPriceFieldError = !!errors && 'price' in errors; // ✅
  const priceFieldErrorMsg = errors?.price ?? ''; // ✅
  const haveErrors = !!errors; // ✅

  // ✅
  const handleFormValuesChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (name === 'price') {
      setFormState((oldVal) => ({
        ...oldVal,
        price: +value || 0,
      }));
      return;
    }
    setFormState((oldVal) => ({
      ...oldVal,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    onClose();
    setFormState(initialFormState);
  };

  // ✅
  const validateForm = async () => {
    try {
      const FormStateSchema = z.object({
        title: z.string().trim().min(5),
        description: z.string().trim().min(10),
        price: z.number().positive().min(1).max(MAX_PRICE),
        image: z.string().trim().url().nullable(),
      });
      const validatedFormState = await FormStateSchema.parseAsync(formState);
      // console.log('formState after validation: ', validatedFormState);
      // resetting errors
      setFormState((oldVal) => ({
        ...oldVal,
        errors: null,
      }));
      return validatedFormState;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorIssues = error.issues;
        const errors: UknownObject = {};
        for (const errorObject of errorIssues) {
          if (typeof errorObject.path[0] === 'string') {
            const errorFieldName: string = errorObject.path[0];
            errors[errorFieldName] = errorObject.message;
          }
        }
        setFormState((oldVal) => ({
          ...oldVal,
          errors,
        }));
      }
      return Promise.reject(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('formState upon submitting form: ', formState);
    try {
      const validatedFormState = await validateForm();
      if (!validatedFormState) return;
      const { title, description, price, image } = validatedFormState;

      // ✔️ define main operation here like create or update product.
      await onFormSubmittion({ title, description, price, image });
    } catch (error) {
      toast.error('Unable to create  product 😮');
      throw error;
    }
  };

  return (
    <Modal showModal={showModal}>
      <div className='bg-white rounded-lg w-[40%] min-w-[400px]'>
        {/* ------------- upper control board ----------------- */}
        <div className='flex justify-end items-center px-6 py-5 mb-2 border-b-2 border-gray-100'>
          {/* --------- close btn ---------- */}
          <button
            onClick={handleCloseModal}
            className='text-xs flex-center p-2 text-black hover:bg-gray-300 bg-gray-200 rounded-full cursor-pointer'
          >
            <FiX />
          </button>
        </div>
        {/* ------------- form ----------- */}
        <div className='px-10 pb-10 pt-4'>
          <h3 className='text-xl font-semibold'>Create Product</h3>
          <form onSubmit={handleFormSubmit}>
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
              {/* <div></div> */}
              {/* --------- title ------------- */}
              <div className='flex flex-col gap-y-3'>
                <label htmlFor='title'>
                  Title
                  <RequiredInputSymbol />
                </label>
                <input
                  disabled={allInputsDisabled}
                  type='text'
                  id='title'
                  name='title'
                  className={`input {}`}
                  value={title}
                  onChange={handleFormValuesChange}
                  placeholder='Product Title'
                />
                {isTitleFieldError && titleFieldErrorMsg && (
                  <p className='text-red-500 text-xs'>{titleFieldErrorMsg}</p>
                )}
              </div>
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
              {/* --------- price ------------- */}
              <div className='flex flex-col gap-y-3'>
                <label htmlFor='price'>
                  Price
                  <RequiredInputSymbol />
                </label>
                <input
                  disabled={allInputsDisabled}
                  type='text'
                  id='price'
                  name='price'
                  className='input'
                  value={price}
                  onChange={handleFormValuesChange}
                />
                {isPriceFieldError && priceFieldErrorMsg && (
                  <p className='text-red-500 text-xs'>{priceFieldErrorMsg}</p>
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
                Create
                <Spinner show={allInputsDisabled} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CreateUpdateProductModal;
