import { z } from 'zod';

export const getAllProductsSchema = z.object({
  page: z.number().int().positive().min(1).optional().default(1),
  limit: z.number().int().positive().min(5).max(30).optional().default(10),
});

export type GetAllProducts = z.infer<typeof getAllProductsSchema>;
