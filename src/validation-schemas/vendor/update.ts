import { z } from 'zod';

export const updateVendorSchema = z.object({});

export type UpdateVendor = z.infer<typeof updateVendorSchema>;
