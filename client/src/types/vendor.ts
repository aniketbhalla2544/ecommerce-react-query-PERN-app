export type Vendor = {
  id: string;
  vendorSlug: string;
  email: string;
  fullname: string;
  isPremium: boolean;
};

export type RegisterVendor = Pick<Vendor, 'fullname' | 'email'> & {
  password: string;
};

export type SigninVendor = Pick<Vendor, 'email'> & {
  password: string;
};
