import { Request, Response } from 'express';
// import { z } from 'zod';
import createHttpError from 'http-errors';

async function signinVendor(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw createHttpError(401, 'Unauthorized request', {
      isAuthHeaderNotFound: true,
    });
  }

  const encodedCredentials = authHeader.split(' ')[1];

  res.json({
    success: true,
    authHeader,
    encodedCredentials,
  });
}

export const authControllersV1 = {
  signinVendor,
};
