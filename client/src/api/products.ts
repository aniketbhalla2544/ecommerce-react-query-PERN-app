import { Product, Products } from '../types/products';
import { apiClient } from './config';

type FetchProductsQueryResponse = {
  success: boolean;
  data: Products;
  meta: {
    productsCount: number;
    offset: number;
    currentPage: number;
    limit: number;
    totalProductPages: number;
  };
};

export const fetchProducts = async (page: number = 1, limit: number = 5) => {
  const { data } = await apiClient.get<FetchProductsQueryResponse>(
    `/products?page=${page}&limit=${limit}`
  );
  return data;
};

export const deleteProduct = async (productId: number) => {
  await apiClient.delete(`/products/${productId}`);
};

export const createProduct = async (product: Omit<Product, 'product_id'>) => {
  const { title, price, description, image } = product;
  await apiClient.post('/products/', {
    title,
    description,
    price,
    image,
  });
};
