const AUTH_API_URL = process.env.NEXT_PUBLIC_API_URL_AUTH;

if (!AUTH_API_URL) {
  console.warn("NEXT_PUBLIC_API_URL_AUTH is not defined.");
}

export const AUTH_ENDPOINTS = {
  login: `${AUTH_API_URL}/login`,
  singup: `${AUTH_API_URL}/signup`,
  logout: `${AUTH_API_URL}/logout`,
  forgotPassword: `${AUTH_API_URL}/forgot-password`,
  verifyResetCode: `${AUTH_API_URL}/verify-reset-code`,
};
