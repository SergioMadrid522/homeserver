import * as z from "zod";

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Introduce un correo válido." })
    .max(320),
});
