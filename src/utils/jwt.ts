import { sign } from 'jsonwebtoken';

type JWTPayload = Parameters<typeof sign>[0];
type JWTConfig = Parameters<typeof sign>[2] | undefined;

export async function generateJwtToken(
  payload: JWTPayload,
  secretKey: string,
  config?: JWTConfig
) {
  return sign(payload, secretKey, config);
}
