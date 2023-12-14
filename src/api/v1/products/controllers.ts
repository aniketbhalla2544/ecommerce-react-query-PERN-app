import { Request, Response } from 'express';
import { z } from 'zod';
import createHttpError from 'http-errors';
import { getOffset } from '../../db/queryHelpers';
import { pgquery } from '../../../db';
import { getLoggedInVendorId } from '../../../middlewares/checkVendorAuthorization';
import { getZodValidationIssues, isZodError } from '../../../utils/errorHandlingUtils';
import { productServices } from './services';

async function getProduct(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  const productId = Number(req.params.id.trim());

  const getProductQueryResult = await pgquery({
    text: `SELECT product_id, vendor_id, title, price, description, image FROM products 
          WHERE vendor_id = $1 AND is_archived = false AND product_id = $2`,
    values: [vendorId, productId],
  });
  const { rowCount, rows } = getProductQueryResult;
  if (!rowCount || !rows.length) {
    throw createHttpError(404, 'Product not found', {
      productId,
    });
  }

  return res.json({
    success: !!rowCount && !!rows.length,
    data: rows[0],
  });
}

async function getProducts(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);

  // ✔️ page, limit, offset
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 10;
  const currentPage: number = Math.abs(Number(req.query.page)) || DEFAULT_PAGE;
  const limit: number = Number(req.query.limit) || DEFAULT_LIMIT;
  const offset = getOffset(currentPage, limit);

  // selects undeleted products for user_id = 1 sorted by created_at in descending order
  const sortedProductsQuery = pgquery({
    text: `SELECT product_id, vendor_id, title, price, description, image FROM products 
          WHERE vendor_id = $1 AND is_archived = false
          ORDER BY created_at DESC
          LIMIT $2 OFFSET $3;`,
    values: [vendorId, limit, offset],
  });

  // calculates total product pages with given limit and conditionally fetched products
  const totalProductPagesQuery = pgquery({
    text: `SELECT CEIL(COUNT(*)::DECIMAL/$1::DECIMAL) AS total_pages 
          FROM (
                SELECT product_id FROM products
                WHERE vendor_id = $2 AND is_archived = false
                ) AS products;`,
    values: [limit, vendorId],
  });
  const responses = await Promise.all([sortedProductsQuery, totalProductPagesQuery]);
  const [sortedProductsQueryResponse, totalProductPagesQueryResponse] = responses;
  const { rows: data, rowCount: productsCount } = sortedProductsQueryResponse;
  const totalProductPages =
    Math.abs(Number(totalProductPagesQueryResponse.rows[0]['total_pages'])) || 0;

  return res.json({
    success: !!totalProductPages && !!productsCount,
    meta: {
      productsCount,
      offset,
      currentPage,
      limit,
      totalProductPages,
    },
    data,
  });
}

async function createProduct(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  // const uploadedImgPublicId = res.locals?.uploadedImgDetails.public_id ?? null;

  const newProduct = {
    title: req.body.title,
    description: req.body.description,
    price: +req.body.price,
    imageURL: res.locals?.uploadedImgDetails?.secure_url || null,
  };

  // ✅ product type validation
  const ProductSchema = z.object({
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().min(10),
    price: z.number().min(1),
    imageURL: z.string().trim().url().optional().nullable(),
  });
  const validatedNewProduct = ProductSchema.parse(newProduct);

  const response = await pgquery({
    text: `INSERT INTO products (vendor_id, title, price, description, image) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING title, price, description, image`,
    values: [
      vendorId,
      validatedNewProduct.title,
      validatedNewProduct.price,
      validatedNewProduct.description,
      validatedNewProduct.imageURL,
    ],
  });
  const insertedProduct = response.rows[0];

  return res.json({
    success: !!insertedProduct,
    msg: 'Product successfully created',
    createdProduct: insertedProduct,
  });
}

async function deleteProduct(req: Request, res: Response) {
  try {
    const vendorId = getLoggedInVendorId(res);
    const productId = +req.params.id.trim();

    // ✅
    const ValidateProductId = z.number().min(1);
    const validProductId = await ValidateProductId.parseAsync(productId);
    const queryResult = await productServices.deleteProduct(validProductId, vendorId);
    const { rowCount: totalDeletedProducts } = queryResult;

    // ✅
    if (!totalDeletedProducts) {
      throw createHttpError(404, {
        deleted: !!totalDeletedProducts,
        error: 'Product not found',
        productId,
      });
    }

    return res.json({
      deleted: !!totalDeletedProducts,
      msg: 'product deleted',
      productId,
    });
  } catch (error) {
    console.log('in catch block');
    if (isZodError(error)) {
      console.log('catch block > is zod error');
      const issue = getZodValidationIssues(error) as z.ZodIssue;
      console.log('[deleteProduct]: error: ', issue);
      throw createHttpError(400, {
        error: issue.message,
        productId: req.params.id,
      });
    }
    throw error;
  }
}

async function updateProduct(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  const productId = Number(req.params.id.trim());
  const reqBody = req.body;

  const updatedProduct = {
    title: reqBody.title,
    description: reqBody.description,
    price: +reqBody.price,
    image: res.locals?.uploadedImgDetails?.secure_url || reqBody.imageURL || null,
  };

  // validate the req body
  const ProductSchema = z.object({
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().min(10),
    price: z.number().min(1),
    image: z.string().trim().url().nullable(),
  });
  const validtedUpdatedProduct = ProductSchema.parse(updatedProduct);
  const { image, price, title, description } = validtedUpdatedProduct;

  const updateQueryResponse = await pgquery({
    text: `UPDATE products 
    SET image = $1, price = $2, title = $3, description = $4
    WHERE product_id = $5 AND is_archived = false AND vendor_id = $6;`,
    values: [image, price, title, description, productId, vendorId],
  });
  const { rowCount } = updateQueryResponse;

  if (!rowCount) {
    throw createHttpError(404, 'Product not found', {
      productId,
    });
  }

  return res.json({
    success: !!rowCount,
    updateQueryResponse,
    productId,
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
