import { Response, CookieOptions } from 'express';

export async function setAuthCookie(res: Response, token: string) {
  const options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 60 * 60 * 1000, //2h
    sameSite: 'lax',
    path: '/',
  };
  res.cookie('sessionCookie', token, options);
}
