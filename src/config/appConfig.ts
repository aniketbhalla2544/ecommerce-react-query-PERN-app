import { ConfigOptions } from 'cloudinary';

const env = process.env;

const cloudinary: ConfigOptions = {
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
};

const login = {
  refreshAccessToken: {
    secretKey: env.VENDOR_LOGIN_REFRESH_TOKEN_SECRET_KEY,
    cookieName: 'login-refresh',
  },
  accessToken: {
    secretKey: env.VENDOR_LOGIN_ACCESS_TOKEN_SECRET_KEY,
  },
};

const appConfig = {
  cloudinary,
  vendor: {
    login,
  },
};

export default appConfig;
