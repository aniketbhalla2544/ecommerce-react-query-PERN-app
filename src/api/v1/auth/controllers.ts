import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { z } from 'zod';
import { getZodValidationIssues, isZodError } from '../../../utils/errorHandlingUtils';
import { vendorServices } from '../vendors/services';
import { Vendor } from '../../../types/vendor';
import jwt from 'jsonwebtoken';
import { isProductionEnv } from '../../../utils/helpers';
import appConfig from '../../../config/appConfig';

const MINS_10 = 1000 * 60 * 10;
const refreshAccessTokenCookieName = appConfig.vendor.login.refreshAccessToken.cookieName;

async function signinVendor(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const doesAuthHeaderhasBasicKeyword = !!authHeader?.includes('Basic');
  const encodedCredentials = authHeader?.split(' ')[1];

  // ✅ validating basic Authorization header
  if (
    !authHeader ||
    !doesAuthHeaderhasBasicKeyword ||
    !encodedCredentials ||
    !(encodedCredentials?.length ?? 0)
  ) {
    console.log('Error signinVendor: Invalid authorization header, header: ', authHeader);
    throw createHttpError(401, 'Unauthorized request');
  }

  try {
    // ✅ validating login credentials
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

    // ✅ for existing vendor with the email
    const queryResponse = await vendorServices.getVendor('email', validatedEmail);
    const { rowCount, rows } = queryResponse;
    if (!rowCount) {
      console.log(
        `Error signinVendor: no existing vendor with email ${validatedEmail} found in the records.`
      );
      throw createHttpError(400, 'Invalid credentials', {
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
    const loginRefreshAccessTokenSecretKey =
      appConfig.vendor.login.refreshAccessToken.secretKey;
    appConfig.vendor.login;
    if (!loginRefreshAccessTokenSecretKey) {
      console.log(
        'Error signinVendor: loginRefreshAccessTokenSecretKey not found while signing in vendor'
      );
      throw createHttpError(500, 'Error while signing in');
    }
    const refreshToken = jwt.sign(
      {
        id: vendor.vendor_id,
        email: vendor.email,
        slug: vendor.vendor_slug,
      },
      loginRefreshAccessTokenSecretKey,
      {
        expiresIn: '7d',
      }
    );

    res.cookie(refreshAccessTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: isProductionEnv,
      maxAge: MINS_10,
    });

    // ☑️ creating jwt login access token
    const loginAccessTokenSecretKey = appConfig.vendor.login.accessToken.secretKey;
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
      loginAccessToken,
    });
  } catch (e) {
    // ☑️ removing http only cookie
    res.clearCookie(refreshAccessTokenCookieName);

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
    }
    throw e;
  }
}

async function signoutVendor(req: Request, res: Response) {
  res.send('done');
}

export const authControllersV1 = {
  signinVendor,
  signoutVendor,
};
