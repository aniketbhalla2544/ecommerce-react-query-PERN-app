import { z } from 'zod';
import { idSchema } from '../shared/id';
import { imageFileTypeSchema } from '../shared/image-file-type';

export const updateProductSchema = z
  .object({
    id: idSchema,
    title: z.string().trim().min(5).optional(), // ✅
    description: z.string().trim().min(10).optional(), // ✅
    price: z.number().int().positive().min(1).max(1_00_000).optional(),
    file: imageFileTypeSchema.optional(),
  })
  .refine((validatedProduct) => {
    // ✅ validating if at least one of the optional props exists in req.body to update the product
    type ValidatedProductKey = keyof typeof validatedProduct;
    const optionalFields = ['title', 'description', 'price', 'file'];
    const oneOptionalFieldExists = optionalFields.some((optionalField) => {
      return (
        optionalField in validatedProduct &&
        validatedProduct[optionalField as ValidatedProductKey] !== undefined
      );
    });
    if (!oneOptionalFieldExists) {
      throw new z.ZodError([
        {
          message: 'No product data found to update the product',
          path: ['noDataFound'], // Custom path
          code: 'custom',
        },
      ]);
    }
    return true;
  });

export type UpdateProduct = z.infer<typeof updateProductSchema>;

export async function validateWithUpdateProductSchema(data: unknown) {
  return await updateProductSchema.parseAsync(data);
}
