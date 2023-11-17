export type Vendor = {
  vendor_id: number;
  vendor_slug: string;
  email: string;
  fullname: string;
  hash_password: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
};

export type VendorKeys = keyof Vendor;
