import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { getLoggedInVendorId } from '../../../middlewares/checkVendorAuthorization';
import { vendorServices } from './services';
import { CreateVendor } from '../../../validation-schemas/vendor/create';
import { Vendor } from '../../../validation-schemas/vendor/vendor';

async function registerVendor(req: Request, res: Response) {
  const validatedVendor = res.locals.validatedVendor as CreateVendor;

  // ✅ creating vendor
  const registeredVendor = await vendorServices.createVendor({
    email: validatedVendor.email,
    fullname: validatedVendor.fullname,
    password: validatedVendor.password,
  });

  res.json({
    success: !!registeredVendor,
    msg: 'Vendor registered successfully',
    data: {
      vendorSlug: registeredVendor.vendorSlug,
    },
  });
}

async function getVendor(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  const foundVendor = await vendorServices.getVendorById(vendorId);
  if (!foundVendor) {
    console.log(`[getVendor error]: vendor with id: ${vendorId} not found`);
    throw createHttpError(404, 'Vendor not found', {
      vendorId,
    });
  }

  const vendor: Partial<Vendor> = {
    id: String(foundVendor.id) as unknown as number,
    email: foundVendor.email,
    fullname: foundVendor.fullname,
    isPremium: foundVendor.isPremium,
    vendorSlug: foundVendor.vendorSlug,
  };

  res.json({
    success: !!foundVendor,
    data: vendor,
  });
}

async function updateVendor(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  console.log(vendorId)
  const keys = Object.keys(req.body)
  let queryString = "";
  
  for(const key of keys){
    queryString +=key+"="+`'${req.body[key]}',`
  }
  // to remove last quamma
  queryString = queryString.slice(0 , queryString.length -1)
  const requestResponse = await vendorServices.updateVendor(queryString , vendorId )
  const { rowCount, rows } = requestResponse;
 
  res.json({
    success: !!rowCount && !!rows.length,
    // data: {
    //   email: vendor.email,
    //   fullname: vendor.fullname,
    //   isPremium: vendor.is_premium,
    //   vendorId: String(vendor.vendor_id),
    //   vendorSlug: vendor.vendor_slug,
    // }, 
  });
}
async function deleteVendor(req: Request, res: Response) {
  const vendorId = getLoggedInVendorId(res);
  
  const requestResponse = await vendorServices.deleteVendor(vendorId )
  const { rowCount, rows } = requestResponse;
  
  res.json({
    success: !!rowCount ,
    // data: {
    //   email: vendor.email,
    //   fullname: vendor.fullname,
    //   isPremium: vendor.is_premium,
    //   vendorId: String(vendor.vendor_id),
    //   vendorSlug: vendor.vendor_slug,
    // }, 
  });
}

export const vendorControllersV1 = {
  registerVendor,
  getVendor,
  updateVendor,
  deleteVendor,
};
