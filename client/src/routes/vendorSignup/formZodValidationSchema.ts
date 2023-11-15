import { z } from 'zod';
import validator from 'validator';

const vendorSignupFormZodValidationSchema = z
  .object({
    fullname: z
      .string()
      .trim()
      .min(4, 'Error: Minimum 4 chars are required')
      .max(40, 'Error: Max 40 chars are allowed'),
    email: z.string().trim().email('Error: Invalid email'),
    password: z.string(),
  })
  .refine(
    (data) => {
      const dataPassword = data.password;
      console.log('password: ', dataPassword);
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
      console.log('valid password: ', {
        isStrongPassword,
        noSpacesInPassword,
        isPasswordValid,
      });
      return isPasswordValid;
    },
    {
      path: ['password'],
      message: 'Error: please enter the password in the valid format',
    }
  );

export default vendorSignupFormZodValidationSchema;
