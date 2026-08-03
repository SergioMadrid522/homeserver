import * as jose from 'jose';
import 'dotenv/config';

const SECRET = process.env.JWT_SECRET;
const secret = new TextEncoder().encode(SECRET);

export async function signJwt(payload: Record<string, unknown>) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('error: ', error);
    return null;
  }
}
