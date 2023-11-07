const isProductEnv = process.env.NODE_ENV === 'production';

export const logger = {
  log: (...args: unknown[]) => {
    if (!isProductEnv) {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (!isProductEnv) {
      console.error(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (!isProductEnv) {
      console.warn(...args);
    }
  },
};
