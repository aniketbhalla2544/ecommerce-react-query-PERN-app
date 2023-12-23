import { NextFunction, Request, Response } from 'express';
import { vendorServices } from '../services';
import createHttpError from 'http-errors';
import { updateVendorSchema } from '../../../../validation-schemas/vendor/update';
import { getLoggedInVendorId } from '../../../../middlewares/checkVendorAuthorization';

const validateUpdateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sentVendorDetails = req.body;
  const validatedVendor = await updateVendorSchema.parseAsync(sentVendorDetails); 
  
  // ✅ check existing vendor with slug
  if(validatedVendor.vendorSlug){
      const vendor = await vendorServices.getVendorBySlug(validatedVendor.vendorSlug);
 
      if (vendor && vendor?.id != getLoggedInVendorId(res)) {
            throw createHttpError(409, 'A vendor with this slug already exists.', {
              vendorSlug: validatedVendor.vendorSlug,
              isVendorConflictError: true,
            });
          }
  }
  if(validatedVendor.email){
    const vendor = await vendorServices.getVendorByEmail(validatedVendor.email);
 
    if (vendor && vendor?.id != getLoggedInVendorId(res)) {
          throw createHttpError(409, 'A vendor with this email already exists.', {
            email: validatedVendor.email,
            isVendorConflictError: true,
          });
        }
}

  

  res.locals.validatedVendor = validatedVendor;
  next();
}; 

export default validateUpdateVendor;
