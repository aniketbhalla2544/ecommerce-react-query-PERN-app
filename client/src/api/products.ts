import { MutationProduct } from '../components/dashboard/dashboardProducts/sub-components/paginatedProducts/sub-components/CreateProductModal';
import { Product, Products } from '../types/products';
import { apiClient } from './api.config';

// ---------- fetchProducts
export type FetchProductsQueryResponse = {
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

// ---------- fetchProduct
type FetchProductQueryResponse = {
  success: boolean;
  data: Product;
};

export const fetchProduct = async (productId: number) => {
  const { data } = await apiClient.get<FetchProductQueryResponse>(
    `/products/${productId}`
  );
  return data;
};

// ---------- deleteProduct
export const deleteProduct = async (productId: number) => {
  await apiClient.delete(`/products/${productId}`);
};

// ---------- updateProduct
type UpdateProductParams = {
  productId: number;
  product: MutationProduct;
};

export const updateProduct = async ({ productId, product }: UpdateProductParams) => {
  const { title, description, price, image, imageURL } = product;

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('price', String(price));
  formData.append('image', image ?? new File([], '')); // File type
  formData.append('imageURL', imageURL ?? '');

  await apiClient.put(`/products/${productId}`, formData);
};

// ---------- createProduct
export const createProduct = async (product: MutationProduct) => {
  const { title, price, description, image } = product;

  console.log({
    newProduct: product,
  });

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('price', String(price));
  formData.append('image', image ?? new File([], '')); // File type

  await apiClient.post('/products/', formData);
};
