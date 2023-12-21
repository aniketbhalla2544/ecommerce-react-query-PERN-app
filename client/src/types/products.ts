export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  isArchived: boolean;
  vendorId: number;
};

export type ProductWithNoProductId = Omit<Product, 'product_id'>;

export type Products = Product[];

export type UpdateProductFieldType<K extends keyof Product, T> = Omit<Product, K> & {
  [Key in K]: T;
};
