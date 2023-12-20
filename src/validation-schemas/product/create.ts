import { z } from 'zod';
import { imageFileTypeSchema } from '../shared/image-file-type';

export const createProductSchema = z.object({
  title: z.string().trim().min(4).max(120),
  description: z.string().trim().min(10),
  price: z.number().int().positive().min(1),
  file: imageFileTypeSchema,
});

export type CreateProduct = z.infer<typeof createProductSchema>;

export async function validateWithCreateProductSchema(data: unknown) {
  const validatedData = await createProductSchema.parseAsync(data);
  return validatedData;
}
