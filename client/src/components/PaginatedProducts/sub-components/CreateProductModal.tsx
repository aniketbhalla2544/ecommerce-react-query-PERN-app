import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../../../api/products';
import CreateUpdateProductModal from '../utils/CreateUpdateProductModal';
import { ProductWithNoProductId } from '../../../types/products';
import { logger } from '../../../utils/logger';

type ThisProps = {
  showModal: boolean;
  updatePage: (newPage: number) => void;
  onClose: () => void;
};

const CreateProductModal = ({ onClose, showModal, updatePage }: ThisProps) => {
  const queryClient = useQueryClient();
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      updatePage(1);
      queryClient.removeQueries({
        queryKey: ['products'],
        type: 'all',
      });
      onClose();
    },
  });

  const onFormSubmittion = async (product: ProductWithNoProductId) => {
    const { title, description, price, image } = product;
    try {
      logger.log('validatedFormState: ', product);
      await createProductMutation.mutateAsync({
        title,
        description,
        price,
        image,
      });
      toast.success('Product created successfully 😄');
    } catch (error) {
      toast.error('Unable to create  product 😮');
    }
  };

  const onCloseModal = () => {
    onClose();
  };

  return (
    <CreateUpdateProductModal
      modalTitle='Create Product'
      showModal={showModal}
      formSubmitBtnText='Create'
      onClose={onCloseModal}
      onFormSubmittion={onFormSubmittion}
      allInputsDisabled={createProductMutation.isPending}
    />
  );
};

export default CreateProductModal;
