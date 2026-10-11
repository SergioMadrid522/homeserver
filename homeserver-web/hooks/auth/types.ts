import * as z from "zod";
import { LoginSchema } from "./schemas/login.schema";
import { SignUpSchema } from "./schemas/signup.schema";
import { ForgotPasswordSchema } from "./schemas/forgot-password.schema";
import { ResetPasswordSchema } from "./schemas/reset-password.schema";
import { VerifyResetCodeSchema } from "./schemas/verify-reset-code.schema";

export type LoginForm = z.infer<typeof LoginSchema>;
export type SignUpForm = z.infer<typeof SignUpSchema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
export type VerifyResetCodeForm = z.infer<typeof VerifyResetCodeSchema>;
