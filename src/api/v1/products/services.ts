import { pgquery } from '../../../db';

async function deleteProduct(productId: number, vendorId: number) {
  return await pgquery({
    text: `UPDATE products 
    SET is_archived = TRUE
    WHERE is_archived = FALSE AND vendor_id = $1 AND product_id = $2;`,
    values: [vendorId, productId],
  });
}

export const productServices = {
  deleteProduct,
};
