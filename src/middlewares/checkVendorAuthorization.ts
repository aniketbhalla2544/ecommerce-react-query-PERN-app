import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { vendorServices } from '../api/v1/vendors/services';
import { getZodValidationIssues, isZodError } from '../utils/errorHandlingUtils';
import appConfig from '../config/appConfig';
import { Vendor } from '@prisma/client';
import validator from 'validator';
import {
  JwtDecodedVendor,
  jwtDecodedVendorSchema,
} from '../validation-schemas/vendor/jwt-decoded-vendor';
import { refreshAccessTokenCookieName } from '../api/v1/auth/controllers';

const checkVendorAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessJwtToken = validateAuthHeaderAndGetJWTToken(req);
  try {
    const decodedVendor: unknown = await verifyLoginAccessToken(accessJwtToken);
    const validatedDecodedVendor = await validateDecodedVendor(decodedVendor);
    const { id: vendorId } = validatedDecodedVendor;

    // ✅ checking vendor existence
    const existingVendor = await vendorServices.getVendorById(vendorId);
    if (!existingVendor) {
      console.log(`[Error checkVendorAuth]: vendor with id= ${vendorId} doesn't exists`);
      throw createHttpError(401, 'Unauthorized request');
    }

    // vendor property access to all the app controllers
    res.locals.vendor = existingVendor;
    next();
  } catch (error) {
    // clearing refresh access token http-only cookie from frontend / client.
    res.clearCookie(refreshAccessTokenCookieName);

    // ✅ handling jwt token errors
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.NotBeforeError ||
      error instanceof jwt.TokenExpiredError
    ) {
      console.log(
        '[Error checkVendorAuth]: Invalid jwt token found, error: ',
        error.message
      );
      throw createHttpError(401, 'Unauthorized request');
    }
    // ✅ handling decoded vendor zod validation issues
    if (isZodError(error)) {
      const issues = getZodValidationIssues(error);
      console.log(
        '[Error checkVendorAuth]: Invalid type decoded user found in jwt token, issues: ',
        issues
      );
      throw createHttpError(401, 'Unauthorized request');
    }
    throw error;
  }
};

export default checkVendorAuthorization;

async function verifyLoginAccessToken(loginAccessToken: string) {
  const loginAccessTokenSecretKey = appConfig.vendor.login.accessToken.secretKey;
  if (!loginAccessTokenSecretKey) {
    console.log(
      'Error checkVendorAuth: loginAccessTokenSecretKey not found while checking vendor authorization'
    );
    throw createHttpError(500, 'Error while signing in');
  }

  return await new Promise<string | jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(loginAccessToken, loginAccessTokenSecretKey, function (err, decoded) {
      if (err || !decoded) {
        reject(err);
        return;
      }
      resolve(decoded);
    });
  });
}

// ------------- validateDecodedVendor
async function validateDecodedVendor(vendor: unknown): Promise<JwtDecodedVendor> {
  return await jwtDecodedVendorSchema.parseAsync(vendor);
}

//  ----------- utils
export function getLoggedInVendorId(res: Response): number {
  const loggedInVendor: Vendor | undefined = res.locals.vendor;
  const loggedInVendorId = loggedInVendor?.id;
  if (!loggedInVendorId || !+loggedInVendorId) {
    console.log(
      `Error getLoggedInVendorId(): vendor id not found, current vendor id: `,
      loggedInVendorId
    );
    throw createHttpError(401, 'Unauthorized request');
  }
  return loggedInVendorId;
}

export function validateAuthHeaderAndGetJWTToken(req: Request): string {
  const authHeader = req.headers.authorization;
  const doesAuthHeaderHasBearerKeyword = !!authHeader?.includes('Bearer');
  const authHeaderHasValidJwtToken = validator.isJWT(authHeader?.split(' ')[1] ?? '');

  // ✅ validating auth header
  if (!authHeader || !doesAuthHeaderHasBearerKeyword || !authHeaderHasValidJwtToken) {
    console.log('Error checkVendorAuth: invalid auth header, header: ', authHeader);
    throw createHttpError(401, 'Unauthorized request');
  }
  const jwtToken = authHeader.split(' ')[1].trim();
  return jwtToken;
}
