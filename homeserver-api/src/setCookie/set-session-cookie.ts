import { Response, CookieOptions } from 'express';
import { escape } from 'querystring';

export async function setAuthCookie(res: Response, token: string) {
  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 3600000,
  };

  res.cookie('token', token, options);
}
