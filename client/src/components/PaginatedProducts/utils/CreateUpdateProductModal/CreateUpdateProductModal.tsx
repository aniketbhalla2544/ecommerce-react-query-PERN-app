import Modal from '../../../utils/Modal';
import CreateUpdateProductContextProvider, {
  FormStateFields,
} from './context/CreateUpdateProductContextProvider';
import ProductForm from './sub-components/ProductForm';
import UpperControlBoard from './sub-components/UpperControlBoard';
import { MutationProduct } from '../../sub-components/CreateProductModal';

export type PartiallyRequiredFormFieldModalProps = Partial<
  Pick<FormStateFields, 'description' | 'imageURL' | 'price' | 'title'>
>;

export type CreateUpdateProductModalProps = PartiallyRequiredFormFieldModalProps & {
  showModal: boolean;
  modalTitle: string;
  formSubmitBtnText: string;
  allInputsDisabled: boolean;
  onClose: () => void;
  onFormSubmittion: (product: MutationProduct) => Promise<void>;
};

const CreateUpdateProductModal = ({
  imageURL,
  title,
  price,
  description,
  showModal,
  modalTitle,
  formSubmitBtnText,
  allInputsDisabled,
  onClose,
  onFormSubmittion,
}: CreateUpdateProductModalProps) => {
  return (
    <CreateUpdateProductContextProvider
      imageURL={imageURL}
      title={title}
      price={price}
      description={description}
      onClose={onClose}
      onFormSubmittion={onFormSubmittion}
    >
      <Modal showModal={showModal}>
        <div className='bg-white rounded-lg w-[40%] min-w-[400px]'>
          <UpperControlBoard />
          <ProductForm
            modalTitle={modalTitle}
            formSubmitBtnText={formSubmitBtnText}
            allInputsDisabled={allInputsDisabled}
          />
        </div>
      </Modal>
    </CreateUpdateProductContextProvider>
  );
};

export default CreateUpdateProductModal;
