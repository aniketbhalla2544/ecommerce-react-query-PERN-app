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

export const vendorServices = {
  getVendor,
};
