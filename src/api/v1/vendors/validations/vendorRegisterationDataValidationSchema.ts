import { z } from 'zod';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// NOTE: server side

const vendorRegisterationDataValidationSchema = z
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
      // console.log('password: ', dataPassword);
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
      // console.log('valid password: ', {
      //   isStrongPassword,
      //   noSpacesInPassword,
      //   isPasswordValid,
      // });
      return isPasswordValid;
    },
    {
      path: ['password'],
      message: 'Error: please enter the password in the valid format',
    }
  )
  .transform(async (data) => {
    const { fullname, email, password } = data;
    const vendor_slug = createVendorSlug(email);
    const hash_password = await createVendorHashedPassword(password);
    const validatedNewVendorDetails = {
      vendor_slug,
      email,
      fullname,
      hash_password,
    };
    return validatedNewVendorDetails;
  });

export default vendorRegisterationDataValidationSchema;

export type ValidatedRegisteredVendor = z.infer<
  typeof vendorRegisterationDataValidationSchema
>;

// --------------- utils

function createVendorSlug(email: string) {
  const _email = email.split('@')[0];
  const sanitizedEmail = sanitizeStringForVendor(_email);
  const randomString = crypto.randomBytes(10).toString('hex').substring(0, 10);
  const randomDigits = String(Date.now()).substring(0, 5);
  const vendorSlug = `${sanitizedEmail}_${randomString}${randomDigits}`;
  console.log('vendorSlug: ', vendorSlug);
  return vendorSlug;
}

async function createVendorHashedPassword(password: string) {
  const saltRounds = 5;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('hashed pswrd: ', hashedPassword);
  return hashedPassword;
}

// removes anything other than alphanumerics, hyphens, underscores
function sanitizeStringForVendor(str: string) {
  return str.replace(/[^a-zA-Z0-9-_]/g, '');
}
