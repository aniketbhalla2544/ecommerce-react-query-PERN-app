import { z } from 'zod';
import { idSchema } from '../shared/id';

export const jwtDecodedVendorSchema = z.object({
  id: idSchema,
  email: z.string().trim().email(),
  vendorSlug: z.string().trim().min(4),
  iat: z.number(),
  exp: z.number(),
});

export type JwtDecodedVendor = z.infer<typeof jwtDecodedVendorSchema>;
