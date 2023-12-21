import type { Prisma } from '@prisma/client';
import prismaClient from '../../../prisma/prismaClientInstance';
import { pgquery } from '../../../db';
import { Product } from '../../../validation-schemas/product/product';

export const productServices = {
  getProducts,
  updateProduct,
  createProduct,
  getProductById,
  deleteProductById,
  getTotalProductPagesBasedOnLimit,
};

// createProduct ---------------------
type CreateProductArgs = {
  data: Pick<Product, 'title' | 'price' | 'description' | 'image'>;
  vendorId: number;
  select?: Prisma.ProductSelect;
};

async function createProduct({ data, vendorId, select }: CreateProductArgs) {
  const createdProduct = await prismaClient.product.create({
    select,
    data: {
      ...data,
      vendorId,
    },
  });
  console.log(
    `New product created with id: ${createdProduct.id} for vendor with id: ${vendorId}`
  );
  return createdProduct;
}

// getProductById ---------------------
type GetProductByIdArgs = {
  productId: number;
  vendorId: number;
  select?: Prisma.VendorSelect;
};

async function getProductById({ productId, vendorId, select }: GetProductByIdArgs) {
  return await prismaClient.product.findUnique({
    where: {
      id: productId,
      vendorId,
      isArchived: false,
    },
    select,
  });
}

// getProducts ---------------------
type GetProductsArgs = Prisma.ProductFindManyArgs;

async function getProducts(args: GetProductsArgs) {
  const products = await prismaClient.product.findMany(args);
  return products;
}

// deleteProduct ---------------------
type DeleteProductArgs = {
  productId: number;
  vendorId: number;
};

async function deleteProductById({ productId, vendorId }: DeleteProductArgs) {
  const updatedProduct = await prismaClient.product.update({
    where: {
      isArchived: false,
      id: productId,
      vendorId,
    },
    data: {
      isArchived: true,
    },
  });
  const isProductDeleted = updatedProduct.isArchived;
  return isProductDeleted;
}

// deleteProduct ---------------------
type getTotalProductPagesBasedOnLimitArgs = {
  limit: number;
  vendorId: number;
};

/**
 * calculates total product pages with given limit and conditionally fetched products.
 * query syntax is written based upon postgres db and must be changed
 * if switched to some other db using prisma
 */
async function getTotalProductPagesBasedOnLimit({
  limit,
  vendorId,
}: getTotalProductPagesBasedOnLimitArgs): Promise<number> {
  const queryResult = await pgquery({
    text: `SELECT CEIL(COUNT(*)::DECIMAL/$1::DECIMAL) AS total_pages
        FROM (
                SELECT id FROM "Product"
                WHERE "vendorId" = $2 AND "isArchived" = false
              ) AS products;`,
    values: [limit, vendorId],
  });
  const totalProductPages = queryResult.rows[0]['total_pages'];
  return totalProductPages;
}

// updateProduct ---------------------
type UpdateProductArgs = {
  args: Prisma.ProductUpdateArgs;
};

async function updateProduct({ args }: UpdateProductArgs) {
  return prismaClient.product.update({
    ...args,
  });
}
