import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { vendorServices } from '../api/v1/vendors/services';
import { z } from 'zod';
import { getZodValidationIssues, isZodError } from '../utils/errorHandlingUtils';
import appConfig from '../config/appConfig';
import { Vendor } from '../types/vendor';

const checkVendorAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const doesAuthHeaderHasBearerKeyword = !!authHeader?.includes('Bearer');
  const authHeaderHasValidJwtToken = validator.isJWT(authHeader?.split(' ')[1] ?? '');

  // ✅ validating auth header
  if (!authHeader || !doesAuthHeaderHasBearerKeyword || !authHeaderHasValidJwtToken) {
    console.log('Error checkVendorAuth: invalid auth header, header: ', authHeader);
    throw createHttpError(401, 'Unauthorized request');
  }

  try {
    const accessJwtToken = authHeader.split(' ')[1].trim();
    // console.log('--- JWT Token: ', accessJwtToken);
    const decodedVendor = (await verifyLoginAccessToken(accessJwtToken)) as unknown;

    //  ✅ validation of decoded user
    const validatedDecodedVendor = await validateDecodedVendor(decodedVendor);
    const { id: vendorId } = validatedDecodedVendor;
    // console.log('decodedVendor: ', decodedVendor);

    // ✅ checking vendor existence
    const { rowCount, rows } = await vendorServices.getVendor('vendor_id', vendorId);
    if (!rowCount || !rows.length) {
      console.log(`Error checkVendorAuth: vendor with id= ${vendorId} doesn't exists`);
      throw createHttpError(401, 'Unauthorized request');
    }
    const existingVendor = rows[0] as Vendor;

    // console.log('loggedin as: ', existingVendor.fullname);
    res.locals.vendor = existingVendor;

    next();
  } catch (error) {
    // ✅ handling jwt token errors
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.NotBeforeError ||
      error instanceof jwt.TokenExpiredError
    ) {
      console.log('Error checkVendorAuth: Invalid jwt token found, error: ', error);
      throw createHttpError(401, 'Unauthorized request');
    }
    // ✅ handling decoded vendor zod validation issues
    if (isZodError(error)) {
      const issues = getZodValidationIssues(error);
      console.log(
        'Error checkVendorAuth: Invalid type decoded user found in jwt token, issues: ',
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
const ValidDecodedVendorSchema = z.object({
  id: z.number().min(1),
  email: z.string().trim().email(),
  slug: z.string().trim().min(4),
  iat: z.number(),
  exp: z.number(),
});

type ValidDecodedVendor = z.infer<typeof ValidDecodedVendorSchema>;

async function validateDecodedVendor(vendor: unknown): Promise<ValidDecodedVendor> {
  const validatedSchema = await ValidDecodedVendorSchema.parseAsync(vendor);
  return validatedSchema;
}

//  ----------- utils
// const vendorId = getLoggedInVendorId(res);
export function getLoggedInVendorId(res: Response) {
  const loggedInVendorId = res.locals.vendor['vendor_id'] as Vendor['vendor_id'];
  if (!+loggedInVendorId) {
    console.log(
      `Error getLoggedInVendorId(): vendor id not found, current vendor id: `,
      loggedInVendorId
    );
    throw createHttpError(401, 'Unauthorized request');
  }
  return loggedInVendorId;
}
