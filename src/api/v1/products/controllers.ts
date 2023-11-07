import { Request, Response } from 'express';
import { USER_ID, pgquery } from 'db';
import { z } from 'zod';
import createHttpError from 'http-errors';
import { getOffset } from 'api/db/queryHelpers';

async function getProduct(req: Request, res: Response) {
  const userId = USER_ID;
  const productId = Number(req.params.id.trim());

  const getProductQueryResult = await pgquery({
    text: `SELECT product_id, user_id, title, price, description, image FROM products 
          WHERE user_id = $1 AND is_archived = false AND product_id = $2`,
    values: [userId, productId],
  });
  const { rowCount, rows } = getProductQueryResult;

  if (!rowCount) {
    throw createHttpError(404, 'Product not found', {
      productId,
    });
  }

  return res.json({
    success: !!rowCount,
    data: rows[0],
  });
}

async function getProducts(req: Request, res: Response) {
  const userId = USER_ID;

  // ✔️ page, limit, offset
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 10;
  const currentPage: number = Math.abs(Number(req.query.page)) || DEFAULT_PAGE;
  const limit: number = Number(req.query.limit) || DEFAULT_LIMIT;
  const offset = getOffset(currentPage, limit);

  // selects undeleted products for user_id = 1 sorted by created_at in descending order
  const sortedProductsQuery = pgquery({
    text: `SELECT product_id, user_id, title, price, description, image FROM products 
          WHERE user_id = $1 AND is_archived = false
          ORDER BY created_at DESC
          LIMIT $2 OFFSET $3;`,
    values: [userId, limit, offset],
  });

  // calculates total product pages with given limit and conditionally fetched products
  const totalProductPagesQuery = pgquery({
    text: `SELECT CEIL(COUNT(*)::DECIMAL/$1::DECIMAL) AS total_pages 
          FROM (
                SELECT product_id FROM products
                WHERE user_id = $2 AND is_archived = false
                ) AS products;`,
    values: [limit, userId],
  });
  const responses = await Promise.all([sortedProductsQuery, totalProductPagesQuery]);
  const [sortedProductsQueryResponse, totalProductPagesQueryResponse] = responses;
  const { rows: data, rowCount: productsCount } = sortedProductsQueryResponse;
  const totalProductPages =
    Math.abs(Number(totalProductPagesQueryResponse.rows[0]['total_pages'])) || 0;

  return res.json({
    success: !!(totalProductPages && productsCount),
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
  const userId = USER_ID;
  const newProduct = req.body;

  // ✅ product type validation
  const ProductSchema = z.object({
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().min(10),
    price: z.number().min(1).optional().default(1),
    image: z.string().trim().url().nullable().optional(),
  });
  const validatedNewProduct = ProductSchema.parse(newProduct);

  const response = await pgquery({
    text: `INSERT INTO products (user_id, title, price, description, image) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING title, price, description, image`,
    values: [
      userId,
      validatedNewProduct.title,
      validatedNewProduct.price,
      validatedNewProduct.description,
      validatedNewProduct.image,
    ],
  });
  return res.json({
    success: true,
    msg: 'Product successfully created',
    createdProduct: response.rows[0],
  });
}

async function deleteProduct(req: Request, res: Response) {
  const userId = USER_ID;
  const productId = Number(req.params.id.trim());

  const result = await pgquery({
    text: `UPDATE products 
    SET is_archived = true
    WHERE product_id = $1 AND is_archived = FALSE AND user_id = $2`,
    values: [productId, userId],
  });
  const { rowCount: totalDeletedRows } = result;

  if (!totalDeletedRows) {
    throw createHttpError(
      404,
      `Operation failed as product with id = ${productId} not found`
    );
  }

  return res.json({
    success: !!totalDeletedRows,
    msg: `product with id = ${productId} successfully deleted`,
  });
}

async function updateProduct(req: Request, res: Response) {
  const userId = USER_ID;
  const productId = Number(req.params.id.trim());

  // validate the req body
  const ProductSchema = z.object({
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().min(10),
    price: z.number().min(1),
    image: z.string().trim().url().nullable(),
  });
  const validtedUpdatedProduct = ProductSchema.parse(req.body);
  const { image, price, title, description } = validtedUpdatedProduct;

  const updateQueryResponse = await pgquery({
    text: `UPDATE products 
    SET image = $1, price = $2, title = $3, description = $4
    WHERE product_id = $5 AND is_archived = false AND user_id = $6;`,
    values: [image, price, title, description, productId, userId],
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
