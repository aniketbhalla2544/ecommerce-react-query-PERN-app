import { pgquery } from '../../../db';
import { Vendor, VendorKeys } from '../../../types/vendor';

async function getVendor<T extends VendorKeys>(field: T, value: Vendor[T]) {
  return await pgquery({
    text: `SELECT * FROM vendors
    WHERE ${field} = $1
    `,
    values: [value],
  });
}
async function updateVendor(queryString:string, vendorId :number) {  
  return await pgquery({
    text: `UPDATE vendors
    SET  ${queryString}
    WHERE vendor_id = ${vendorId}
    `, 
  }); 
}
async function deleteVendor( vendorId :number) {  
  await pgquery({
    text: `DELETE  FROM products
    WHERE vendor_id = ${vendorId}
    `, 
  });
  return await pgquery({
    text: `DELETE FROM vendors
    WHERE vendor_id = ${vendorId}
    `, 
  });
}

export const vendorServices = {
  getVendor,
  updateVendor,
  deleteVendor
};
