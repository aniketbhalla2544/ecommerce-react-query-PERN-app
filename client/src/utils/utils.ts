export const isProductionEnv = process.env.NODE_ENV === 'production';

export const priceFormatter = (price: number) => {
  const formatterEnCA = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });
  return formatterEnCA.format(price);
};

type GeneratePromiseParams = {
  delay?: number;
  value?: unknown;
  isResolved?: boolean;
};

export const generatePromise = ({
  delay = 4000, // in ms
  value = 5,
  isResolved = true,
}: GeneratePromiseParams) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isResolved) {
        resolve(value);
        return;
      }
      console.log('promise rejected');
      reject(value);
    }, delay);
  });
};
