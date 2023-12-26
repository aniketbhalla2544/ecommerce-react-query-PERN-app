import { z } from 'zod';

export const updateVendorSchema = z.object({
    fullname:z.string(),
    vendorSlug:z.string(),
    email:z.string(),
});

export type UpdateVendor = z.infer<typeof updateVendorSchema>;
