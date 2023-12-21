import { z } from 'zod';
import { idSchema } from '../shared/id';

export const productSchema = z.object({
  id: idSchema,
  vendorId: idSchema,
  title: z.string(),
  price: z.number().int().positive(),
  description: z.string(),
  image: z.string().url(),
  isArchived: z.boolean().optional().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof productSchema>;
