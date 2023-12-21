import { z } from 'zod';
import { idSchema } from '../shared/id';

export const deleteProductSchema = z.object({
  id: idSchema,
});

export type DeleteProduct = z.infer<typeof deleteProductSchema>;
