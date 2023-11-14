import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import { z, ZodError } from 'zod';
import { FieldsObject, UknownObject } from '../../../../../types/general';
import {
  CreateUpdateProductModalProps,
  PartiallyRequiredFormFieldModalProps,
} from '../CreateUpdateProductModal';

const MAX_PRICE = 1_00_000;

export type FormStateFields = {
  title: string;
  description: string;
  price: number;
  image: File | null;
  imageURL: string | null;
};

// for form errors object | for storing error msgs
type StringTypeFormStateFields = Partial<FieldsObject<FormStateFields>>;

type FormState = FormStateFields & {
  errors: null | StringTypeFormStateFields;
};

const resetFormState: FormState = {
  description: '',
  errors: null,
  image: null,
  imageURL: null,
  price: 0,
  title: '',
};

type ThisProps = PartiallyRequiredFormFieldModalProps &
  Pick<CreateUpdateProductModalProps, 'onClose' | 'onFormSubmittion'> & {
    children: JSX.Element | JSX.Element[];
  };

type UpdateFormField = (field: keyof FormState, value: string) => void;

type CreateUpdateProductContextType = {
  haveErrors: boolean;
  imageURL: string | null;
  title: string;
  isTitleFieldError: boolean;
  titleFieldErrorMsg: string;
  price: number;
  isPriceFieldError: boolean;
  priceFieldErrorMsg: string;
  description: string;
  isDescriptionFieldError: boolean;
  descriptionFieldErrorMsg: string;
  updateFormField: UpdateFormField;
  updateFormFields: (newValues: Partial<FormState>) => void;
  handleCloseModal: () => void;
  handleFormValuesChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export const CreateUpdateProductContext =
  React.createContext<CreateUpdateProductContextType | null>(null);

const CreateUpdateProductContextProvider = ({
  children,
  imageURL: initialImageURL = null,
  title: initialTitle = '',
  price: initialPrice = 0,
  description: initialDescription = '',
  onClose,
  onFormSubmittion,
}: ThisProps) => {
  const initialFormState: FormState = {
    image: null,
    imageURL: initialImageURL,
    title: initialTitle,
    price: initialPrice,
    description: initialDescription,
    errors: null,
  };
  const [formState, setFormState] = React.useState<FormState>(initialFormState); // ✅
  const { title, description, price, errors } = formState; // ✅
  const isTitleFieldError = !!errors && 'title' in errors; // ✅
  const titleFieldErrorMsg = errors?.title ?? ''; // ✅
  const isDescriptionFieldError = !!errors && 'description' in errors; // ✅
  const descriptionFieldErrorMsg = errors?.description ?? ''; // ✅
  const isPriceFieldError = !!errors && 'price' in errors; // ✅
  const priceFieldErrorMsg = errors?.price ?? ''; // ✅
  const haveErrors = !!errors; // ✅

  const handleFormValuesChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    },
    []
  );

  const updateFormField = useCallback(
    <T extends keyof FormState>(field: keyof FormState, value: FormState[T]) => {
      setFormState((oldVal) => ({
        ...oldVal,
        [field]: value,
      }));
    },
    []
  );

  const updateFormFields = useCallback((newValues: Partial<FormState>) => {
    setFormState((oldVal) => ({
      ...oldVal,
      ...newValues,
    }));
  }, []);

  const handleCloseModal = React.useCallback(() => {
    onClose();
    setFormState(resetFormState);
  }, [onClose]);

  // ✅
  const validateForm = useCallback(async () => {
    try {
      const FormStateSchema = z.object({
        title: z.string().trim().min(5),
        description: z.string().trim().min(10),
        price: z.number().positive().min(1).max(MAX_PRICE),
        image: z.instanceof(File).nullable(),
        imageURL: z.string().trim().url().nullable(),
      });
      const validatedFormState = await FormStateSchema.parseAsync(formState);
      // resetting errors
      setFormState((oldVal) => ({
        ...oldVal,
        errors: null,
      }));
      return validatedFormState;
    } catch (error) {
      toast.error('Unable to create  product 😮');
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
      return null;
    }
  }, [formState]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const validatedFormState = await validateForm();
        if (!validatedFormState) return;
        const { title, description, price, image, imageURL } = validatedFormState;

        // ✔️ define main operation here like create or update product.
        await onFormSubmittion({
          title,
          description,
          price,
          image,
          imageURL: image ? null : imageURL,
        });
      } catch (error) {
        toast.error('Unable to create  product 😮');
        throw error;
      }
    },
    [validateForm, onFormSubmittion]
  );

  return (
    <CreateUpdateProductContext.Provider
      value={{
        imageURL: formState.imageURL,
        haveErrors,
        title,
        isTitleFieldError,
        titleFieldErrorMsg,
        price,
        isPriceFieldError,
        priceFieldErrorMsg,
        description,
        isDescriptionFieldError,
        updateFormField,
        updateFormFields,
        descriptionFieldErrorMsg,
        handleCloseModal,
        handleFormValuesChange,

        handleFormSubmit,
      }}
    >
      {children}
    </CreateUpdateProductContext.Provider>
  );
};

export default CreateUpdateProductContextProvider;
