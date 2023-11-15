import { ZodError } from 'zod';
import { UknownObject } from '../types/general';

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

export function getZodValidationIssues(error: unknown) {
  if (isZodError(error)) {
    const errorIssues = error.issues;
    // console.log(errorIssues);
    const errors: UknownObject = {};
    for (const errorObject of errorIssues) {
      if (typeof errorObject.path[0] === 'string') {
        const errorFieldName: string = errorObject.path[0];
        errors[errorFieldName] = errorObject.message;
      }
    }
    return errors;
  }
  return null;
}
