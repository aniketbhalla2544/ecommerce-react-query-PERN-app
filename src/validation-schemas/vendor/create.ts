import { z } from 'zod';
import validator from 'validator';

export const createVendorSchema = z
  .object({
    fullname: z
      .string()
      .trim()
      .min(4, 'Minimum 4 chars are required')
      .max(40, 'Max 40 chars are allowed'),
    email: z.string().trim().email('Error: Invalid email'),
    password: z.string(),
  })
  .refine(
    (data) => {
      const dataPassword = data.password;
      const isStrongPassword = validator.isStrongPassword(dataPassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      });
      const inBetweenSpaceCheckingRegex = /\s/;
      const noSpacesInPassword = !inBetweenSpaceCheckingRegex.test(dataPassword);
      const isPasswordValid = isStrongPassword && noSpacesInPassword;
      return isPasswordValid;
    },
    {
      path: ['password'],
      message:
        'Invalid password minLength: 8,  minLowercase: 1, minUppercase: 1, minNumbers: 1,  minSymbols: 1',
    }
  );

export type CreateVendor = z.infer<typeof createVendorSchema>;
