import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateProduct, fetchProduct } from '../../../api/products';
import CreateUpdateProductModal from '../utils/CreateUpdateProductModal/CreateUpdateProductModal';
import { ProductWithNoProductId } from '../../../types/products';
import { logger } from '../../../utils/logger';

type ThisProps = {
  productId: number;
  showModal: boolean;
  onClose: () => void;
};

const UpdateProductModal = ({ onClose, showModal, productId }: ThisProps) => {
  const queryClient = useQueryClient();
  const isProductQueryEnabled = !!productId && showModal;

  const {
    isPending,
    isError,
    data: queryResponse,
  } = useQuery({
    queryKey: ['products', { id: productId }],
    queryFn: () => fetchProduct(productId),
    enabled: isProductQueryEnabled,
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
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
      // logger.log('validatedFormState: ', validatedFormState);
      await updateProductMutation.mutateAsync({
        productId,
        product: { title, description, price, image },
      });
      toast.success('Product updated successfully 😄');
      logger.log(product);
    } catch (error) {
      toast.error('Unable to update  product 😮');
      logger.error(error);
    }
  };

  const onCloseModal = () => {
    onClose();
  };

  if (isPending) {
    return <></>;
  }

  if (isError) {
    toast.error('Unable to update product');
    logger.error(
      'Unable to update product because error while fetching single product with id: ',
      productId
    );
    return <></>;
  }

  const { data } = queryResponse;

  return (
    <CreateUpdateProductModal
      description={data.description}
      image={data.image}
      price={data.price}
      title={data.title}
      formSubmitBtnText='Update'
      modalTitle='Update Product'
      showModal={showModal}
      allInputsDisabled={updateProductMutation.isPending}
      onClose={onCloseModal}
      onFormSubmittion={onFormSubmittion}
    />
  );
};

export default UpdateProductModal;
