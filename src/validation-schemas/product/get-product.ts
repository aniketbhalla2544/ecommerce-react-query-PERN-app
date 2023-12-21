import { z } from 'zod';
import { idSchema } from '../shared/id';

export const getProductSchema = z.object({
  id: idSchema,
});

export type GetProduct = z.infer<typeof getProductSchema>;
