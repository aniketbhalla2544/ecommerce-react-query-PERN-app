import { z } from 'zod';

const vendorSigninFormZodValidationSchema = z.object({
  email: z.string().trim().email('Error: Invalid email'),
  password: z.string().min(1, {
    message: 'Error: password is required',
  }),
});

export default vendorSigninFormZodValidationSchema;
