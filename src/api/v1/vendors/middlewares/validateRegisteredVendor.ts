import { NextFunction, Request, Response } from 'express';
import vendorRegisterationDataValidationSchema from '../validations/vendorRegisterationDataValidationSchema';
import { pgquery } from '../../../../db';
import createHttpError from 'http-errors';

const validateRegisteredVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const registeredVendor = req.body;

  const validatedRegisteredVendor =
    await vendorRegisterationDataValidationSchema.parseAsync(registeredVendor);

  // ✅ existing vendor
  const getProductQueryResult = await pgquery({
    text: `SELECT * FROM vendors
    WHERE email = $1;`,
    values: [validatedRegisteredVendor.email],
  });
  const { rowCount } = getProductQueryResult;
  if (rowCount) {
    throw createHttpError(409, 'A vendor with this email already exists.', {
      email: validatedRegisteredVendor.email,
      isVendorConflictError: true,
    });
  }

  res.locals.validatedRegisteredVendor = validatedRegisteredVendor;
  next();
};

export default validateRegisteredVendor;
