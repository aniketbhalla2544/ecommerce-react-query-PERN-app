import { z } from 'zod';

export const idSchema = z.number().int().positive().min(1);

export type Id = z.infer<typeof idSchema>;
