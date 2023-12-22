export const isProductionEnv = process.env.NODE_ENV === 'production';

export function removeUndefinedProps<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {};
  Object.keys(obj).forEach((key) => {
    const k = key as keyof T;
    if (obj[k] !== undefined) {
      result[k] = obj[k];
    }
  });
  return result;
}
