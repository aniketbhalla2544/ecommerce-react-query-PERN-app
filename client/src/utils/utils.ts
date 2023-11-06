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
  resolveValue?: boolean;
};

export const generatePromise = ({
  delay = 4000,
  value = 5,
  resolveValue = true,
}: GeneratePromiseParams) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (resolveValue) {
        resolve(value);
        return;
      }
      reject(value);
    }, delay);
  });
};
