export type Product = {
  product_id: number;
  title: string;
  price: number;
  description: string;
  image: null | string;
};

export type ProductWithNoProductId = Omit<Product, 'product_id'>;

export type Products = Product[];
