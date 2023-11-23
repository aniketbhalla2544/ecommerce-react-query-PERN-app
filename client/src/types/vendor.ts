export type Vendor = {
  email: string;
  fullname: string;
  isPremium: boolean;
  vendorId: string;
  vendorSlug: string;
};

export type RegisterVendor = Pick<Vendor, 'fullname' | 'email'> & {
  password: string;
};

export type SigninVendor = Pick<Vendor, 'email'> & {
  password: string;
};
