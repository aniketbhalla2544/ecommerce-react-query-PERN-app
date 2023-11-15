import { isProductionEnv } from './utils';

export const logger = {
  log: (...args: unknown[]) => {
    if (!isProductionEnv) {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (!isProductionEnv) {
      console.error(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (!isProductionEnv) {
      console.warn(...args);
    }
  },
};
