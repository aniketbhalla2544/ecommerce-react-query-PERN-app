import { NextFunction, Request, Response } from 'express';
import { vendorServices } from '../services';
import createHttpError from 'http-errors';
import { createVendorSchema } from '../../../../validation-schemas/vendor/create';

const validateToBeRegisteredVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sentVendorDetails = req.body;
  const validatedVendor = await createVendorSchema.parseAsync(sentVendorDetails);

  // ✅ check existing vendor with email
  const vendor = await vendorServices.getVendorByEmail(validatedVendor.email);
  if (vendor) {
    throw createHttpError(409, 'A vendor with this email already exists.', {
      email: validatedVendor.email,
      isVendorConflictError: true,
    });
  }

  res.locals.validatedVendor = validatedVendor;
  next();
};

export default validateToBeRegisteredVendor;
