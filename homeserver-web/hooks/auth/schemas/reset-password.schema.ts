import * as z from "zod";

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(1, { message: "La contraseña es obligatoria" }),
});
