import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { getOffset } from '../../db/queryHelpers';
import { getLoggedInVendorId } from '../../../middlewares/checkVendorAuthorization';
import { productServices } from './services';
import { CreateProduct } from '../../../validation-schemas/product/create';
import { GetAllProducts } from '../../../validation-schemas/product/get-all-products';
import { UpdateProduct } from '../../../validation-schemas/product/update';
import { removeUndefinedProps } from '../../../utils/helpers';

async function getProduct(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  const productId = +req.params.id.trim();

  const product = await productServices.getProductById({
    productId,
    vendorId,
  });

  return res.json({
    success: !!product,
    data: product,
  });
}

// paginated products
async function getProducts(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  const { limit, page } = res.locals.validatedGetAllProducts as GetAllProducts;
  const offset = getOffset(page, limit);

  // selects undeleted vendor's products sorted by createdAt in descending order with calculated limit and offset
  const sortedProductsQuery = productServices.getProducts({
    select: {
      id: true,
      vendorId: true,
      title: true,
      price: true,
      description: true,
      image: true,
    },
    where: {
      vendorId,
      isArchived: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
  });

  // calculates total product pages with given limit and conditionally fetched products
  const totalProductPagesQuery = productServices.getTotalProductPagesBasedOnLimit({
    limit,
    vendorId,
  });

  const responses = await Promise.all([sortedProductsQuery, totalProductPagesQuery]);
  const [sortedProducts, totalProductPages] = responses;
  const totalSortedProducts = sortedProducts.length;

  return res.json({
    success: !!totalProductPages && !!totalSortedProducts,
    data: sortedProducts,
    meta: {
      productsCount: totalSortedProducts,
      offset,
      currentPage: page,
      limit,
      totalProductPages,
    },
  });
}

async function createProduct(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  const validatedCreateProduct = res.locals.validatedNewProduct as CreateProduct;
  const cloudinaryUploadedImgURL = res.locals.cloudinaryUploadedImgURL as string;

  const insertedProduct = await productServices.createProduct({
    data: {
      title: validatedCreateProduct.title,
      description: validatedCreateProduct.description,
      price: validatedCreateProduct.price,
      image: cloudinaryUploadedImgURL,
    },
    vendorId,
    select: {
      id: true,
    },
  });

  return res.json({
    success: !!insertedProduct,
    msg: 'Product successfully created',
    insertedProduct,
  });
}

async function deleteProduct(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  const productId = +req.params.id;

  const isProductDeleted = await productServices.deleteProductById({
    productId,
    vendorId,
  });

  if (!isProductDeleted) {
    console.log('[deleteProductById error]: Error while deleting product: ', {
      productId,
      isProductDeleted,
    });
    throw createHttpError(500, 'Error while deleting product', {
      productId,
      isProductDeleted,
    });
  }

  return res.json({
    success: isProductDeleted,
    msg: 'product deleted',
    productId,
  });
}

async function updateProduct(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  const validatedProductUpdate = res.locals.validatedUpdateProduct as UpdateProduct;
  const cloudinaryUploadedProductImgURL = res.locals.cloudinaryUploadedProductImgURL as
    | string
    | undefined;
  const update = removeUndefinedProps({
    title: validatedProductUpdate.title,
    description: validatedProductUpdate.description,
    price: validatedProductUpdate.price,
    image: cloudinaryUploadedProductImgURL,
  });

  const updatedProduct = await productServices.updateProduct({
    args: {
      data: update,
      where: {
        vendorId,
        isArchived: false,
        id: validatedProductUpdate.id,
      },
    },
  });

  return res.json({
    success: !!updatedProduct,
    updatedProduct,
    msg: 'Product updated successfully.',
  });
}

export const productControllersV1 = {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
