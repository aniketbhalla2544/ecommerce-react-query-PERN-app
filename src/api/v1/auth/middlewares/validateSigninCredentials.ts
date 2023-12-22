import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { z } from 'zod';
import { refreshAccessTokenCookieName } from '../controllers';
import { getZodValidationIssues, isZodError } from '../../../../utils/errorHandlingUtils';

// middleware to validate vendor sign-in credentials,
// validating email and password sent using "Basic Authenication" method in authorization header

const signinCredentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export type SigninCredentials = z.infer<typeof signinCredentialsSchema>;

export const validateSigninCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization; // Basic authenitcation header
    const doesAuthHeaderhasBasicKeyword = !!authHeader?.includes('Basic');
    const encodedCredentials = authHeader?.split(' ')[1];

    // ✅ validating basic Authorization header
    if (
      !authHeader ||
      !doesAuthHeaderhasBasicKeyword ||
      !encodedCredentials ||
      !(encodedCredentials?.length ?? 0)
    ) {
      console.log(
        '[Error signinVendor]: Invalid authorization header, header: ',
        authHeader
      );
      throw createHttpError(401, 'Unauthorized request');
    }

    // ✅ validating login credentials
    const decodedCredentials = atob(encodedCredentials).split(':');
    const [email, password] = decodedCredentials;

    const validatedSigninCredentials = await signinCredentialsSchema.parseAsync({
      email,
      password,
    });

    res.locals.validatedSigninCredentials = validatedSigninCredentials;

    next();
  } catch (error) {
    // clearing refresh access token http-only cookie from frontend / client.
    res.clearCookie(refreshAccessTokenCookieName);

    // catching zod validation errors
    if (isZodError(error)) {
      const credentialsTypeIssues = getZodValidationIssues(error);
      console.log(
        '[Error signinVendor]: Invalid type credentials found, error: ',
        credentialsTypeIssues
      );
      throw createHttpError(400, 'Invalid type credentials', {
        invalidTypeCredentials: true,
      });
    }
    throw error;
  }
};
