import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Introduce un correo válido." })
    .max(320),
  password: z
    .string()
    .trim()
    .min(8, { message: "La contraseña es obligatoria" }),
});
