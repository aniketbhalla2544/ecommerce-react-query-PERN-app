import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MutationProduct } from './CreateProductModal';
import { fetchProduct, updateProduct } from '../../../../../../api/products';
import { logger } from '../../../../../../utils/logger';
import CreateUpdateProductModal from '../CreateUpdateProductModal/CreateUpdateProductModal';

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
    refetchOnWindowFocus: false,
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

  const onFormSubmittion = async (product: MutationProduct) => {
    const { title, description, price, image, imageURL } = product;
    try {
      // logger.log('validatedFormState: ', validatedFormState);
      await updateProductMutation.mutateAsync({
        productId,
        product: { title, description, price, image, imageURL },
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
      price={data.price}
      title={data.title}
      imageURL={data.image}
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
