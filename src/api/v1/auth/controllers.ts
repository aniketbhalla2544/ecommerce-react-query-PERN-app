import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { vendorServices } from '../vendors/services';
import jwt from 'jsonwebtoken';
import { isProductionEnv } from '../../../utils/helpers';
import appConfig from '../../../config/appConfig';
import { SigninCredentials } from './middlewares/validateSigninCredentials';
import { JwtDecodedVendor } from '../../../validation-schemas/vendor/jwt-decoded-vendor';

export const refreshAccessTokenCookieName =
  appConfig.vendor.login.refreshAccessToken.cookieName;

type JWTTokenPayload = Pick<JwtDecodedVendor, 'id' | 'email' | 'vendorSlug'>;

// sign-in with email & password
async function signinVendor(req: Request, res: Response) {
  const { email, password } = res.locals.validatedSigninCredentials as SigninCredentials;

  try {
    // ✅ check for existing vendor with the email
    const vendor = await vendorServices.getVendorByEmail(email);
    if (!vendor) {
      console.log(
        `Error signinVendor: no existing vendor with email ${email} found in the records.`
      );
      throw createHttpError(400, 'Invalid credentials', {
        invalidCredentials: true,
      });
    }

    // ✅ check vendor password
    const passwordMatched = await bcrypt.compare(password, vendor.password);
    if (!passwordMatched) {
      console.log(
        `Error signinVendor: password doesn't match for vendor with email: ${email}`
      );
      throw createHttpError(401, 'Unauthorized request', {
        invalidCredentials: true,
      });
    }

    /**
     * creating login refresh jwt access token
     * and setting it to http only cookie
     */
    const loginRefreshAccessTokenSecretKey =
      appConfig.vendor.login.refreshAccessToken.secretKey;

    if (!loginRefreshAccessTokenSecretKey) {
      console.log(
        'Error signinVendor: loginRefreshAccessTokenSecretKey not found while signing in vendor'
      );
      throw createHttpError(500, 'Error while signing in');
    }
    const refreshLoginAccessTokenPayload: JWTTokenPayload = {
      id: vendor.id,
      email: vendor.email,
      vendorSlug: vendor.vendorSlug,
    };
    const refreshToken = jwt.sign(
      refreshLoginAccessTokenPayload,
      loginRefreshAccessTokenSecretKey,
      {
        expiresIn: appConfig.vendor.login.refreshAccessToken.tokenExpiry,
      }
    );

    res.cookie(refreshAccessTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: isProductionEnv,
      maxAge: appConfig.vendor.login.refreshAccessToken.cookieMaxAge,
    });

    // ☑️ creating jwt login access token
    const loginAccessTokenSecretKey = appConfig.vendor.login.accessToken.secretKey;
    if (!loginAccessTokenSecretKey) {
      console.log(
        'Error signinVendor: loginAccessTokenSecretKey not found while signing in vendor'
      );
      throw createHttpError(500, 'Error while signing in');
    }
    const loginAccessTokenPayload: JWTTokenPayload = {
      id: vendor.id,
      email: vendor.email,
      vendorSlug: vendor.vendorSlug,
    };

    const loginAccessToken = jwt.sign(
      loginAccessTokenPayload,
      loginAccessTokenSecretKey,
      {
        expiresIn: appConfig.vendor.login.accessToken.tokenExpiry,
      }
    );

    res.json({
      success: !!vendor && passwordMatched,
      loginAccessToken,
    });
  } catch (e) {
    // ☑️ removing http only cookie
    res.clearCookie(refreshAccessTokenCookieName);
    throw e;
  }
}

async function signoutVendor(req: Request, res: Response) {
  res.clearCookie(refreshAccessTokenCookieName);
  res.sendStatus(202);
}

export const authControllersV1 = {
  signinVendor,
  signoutVendor,
};
