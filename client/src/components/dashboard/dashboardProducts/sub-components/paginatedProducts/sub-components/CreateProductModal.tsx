import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../../../../../../api/products';
import { logger } from '../../../../../../utils/logger';
import CreateUpdateProductModal from '../CreateUpdateProductModal/CreateUpdateProductModal';
import { Product } from '../../../../../../types/products';

export type MutationProduct = Pick<Product, 'description' | 'price' | 'title'> & {
  image: File | null;
  imageURL: string | null;
};

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

  const onFormSubmittion = async (product: MutationProduct) => {
    const { title, description, price, image, imageURL } = product;
    try {
      logger.log('validatedFormState: ', product);
      await createProductMutation.mutateAsync({
        title,
        description,
        price,
        image,
        imageURL,
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
