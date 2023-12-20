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
    tokenExpiry: '7d',
    cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },
  accessToken: {
    secretKey: env.VENDOR_LOGIN_ACCESS_TOKEN_SECRET_KEY,
    tokenExpiry: '1d',
  },
};

const appConfig = {
  cloudinary,
  vendor: {
    login,
  },
};

export default appConfig;
