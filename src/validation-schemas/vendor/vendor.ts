import { z } from 'zod';
import { idSchema } from '../shared/id';

export const vendorSchema = z.object({
  id: idSchema,
  vendorSlug: z.string(),
  email: z.string().email('Error: Invalid email'),
  fullname: z.string(),
  password: z.string(),
  isPremium: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Vendor = z.infer<typeof vendorSchema>;
