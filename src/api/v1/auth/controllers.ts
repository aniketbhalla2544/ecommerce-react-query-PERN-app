import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { z } from 'zod';
import { getZodValidationIssues, isZodError } from '../../../utils/errorHandlingUtils';
import { vendorServices } from '../vendors/services';
import { Vendor } from '../../../types/vendor';
import jwt from 'jsonwebtoken';
import { isProductionEnv } from '../../../utils/helpers';

const env = process.env;
const MINS_10 = 1000 * 60 * 10;
const LOGIN_REFRESH_TOKEN_COOKIE_NAME = 'login-refresh';

async function signinVendor(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('Error signinVendor: authorization header not found');
    throw createHttpError(401, 'Unauthorized request', {
      authHeaderNotFound: true,
    });
  }
  try {
    // ✅ validating login credentials
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = atob(encodedCredentials).split(':');
    const [email, password] = decodedCredentials;

    const CredentialsSchema = z.object({
      email: z.string().trim().email(),
      password: z.string().min(1),
    });
    const validatedCredentials = await CredentialsSchema.parseAsync({
      email,
      password,
    });
    const { email: validatedEmail, password: validatedPassword } = validatedCredentials;

    console.log({
      validatedEmail,
      validatedPassword,
    });

    // ✅ for existing vendor with the email
    const queryResponse = await vendorServices.getVendor('email', validatedEmail);
    const { rowCount, rows } = queryResponse;
    if (!rowCount) {
      console.log(
        `Error signinVendor: no existing vendor with email ${validatedEmail} found in the records.`
      );
      throw createHttpError(401, 'Unauthorized request', {
        invalidCredentials: true,
      });
    }
    const vendor = rows[0] as Vendor;
    const { hash_password } = vendor;

    // ✅ check vendor password
    const passwordMatched = await bcrypt.compare(validatedPassword, hash_password);
    if (!passwordMatched) {
      console.log(
        `Error signinVendor: password doesn't match for vendor with email: ${validatedEmail}`
      );
      throw createHttpError(401, 'Unauthorized request', {
        invalidCredentials: true,
      });
    }

    // ☑️ creating and setting jwt login refresh token
    const loginRefreshTokenSecretKey = env.VENDOR_LOGIN_REFRESH_TOKEN_SECRET_KEY;
    if (!loginRefreshTokenSecretKey) {
      console.log(
        'Error signinVendor: loginRefreshTokenSecretKey not found while signing in vendor'
      );
      throw createHttpError(500, 'Error while signing in');
    }
    const refreshToken = jwt.sign(
      {
        id: vendor.vendor_id,
        email: vendor.email,
        slug: vendor.vendor_slug,
      },
      loginRefreshTokenSecretKey,
      {
        expiresIn: '7d',
      }
    );
    res.cookie(LOGIN_REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: isProductionEnv,
      maxAge: MINS_10,
    });

    // ☑️ creating jwt login access token
    const loginAccessTokenSecretKey = env.VENDOR_LOGIN_ACCESS_TOKEN_SECRET_KEY;
    if (!loginAccessTokenSecretKey) {
      console.log(
        'Error signinVendor: loginAccessTokenSecretKey not found while signing in vendor'
      );
      throw createHttpError(500, 'Error while signing in');
    }
    const loginAccessToken = jwt.sign(
      {
        id: vendor.vendor_id,
        email: vendor.email,
        slug: vendor.vendor_slug,
      },
      loginAccessTokenSecretKey,
      {
        expiresIn: '1d',
      }
    );

    res.json({
      success: !!rowCount && passwordMatched && !!vendor,
      vendorId: vendor.vendor_id,
      vendorSlug: vendor.vendor_slug,
      loginAccessToken,
    });
  } catch (e) {
    // ☑️ removing http only cookie
    res.clearCookie(LOGIN_REFRESH_TOKEN_COOKIE_NAME);

    // catching zod validation errors
    if (isZodError(e)) {
      const credentialsTypeIssues = getZodValidationIssues(e);
      console.log(
        'Error signinVendor: Invalid type credentials found, error: ',
        credentialsTypeIssues
      );
      throw createHttpError(400, 'Invalid type credentials', {
        invalidTypeCredentials: true,
      });
    } else {
      throw e;
    }
  }
}

export const authControllersV1 = {
  signinVendor,
};
