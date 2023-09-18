import axios from 'axios';
import validator from 'validator';
import createHttpError from 'http-errors';
import { Request, Response } from 'express';

const API_URL = 'https://fakestoreapi.com';

async function getProducts(req: Request, res: Response) {
  const limitParam = req.query.limit;
  const limit = typeof limitParam === 'string' && limitParam.trim();

  // ✅ validating query string param "limit" type
  if (limit) {
    const isLimitValid = validator.isInt(limit, {
      min: 1,
    });
    // console.log('isLimitValid: ', isLimitValid);
    if (!isLimitValid) {
      throw createHttpError(400, 'Invalid type of query param limit', {});
    }
  }

  const { data } = await axios(`${API_URL}/products?limit=${limit}`);
  return res.json(data);
}

export const productControllersV1 = {
  getProducts,
};
