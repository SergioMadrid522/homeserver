import * as z from "zod";

export const SignUpSchema = z.object({
  name: z.string().trim().nonempty(),
  lastname: z.string().trim().nonempty(),
  email: z
    .string()
    .trim()
    .email({ message: "Introduce un correo válido." })
    .max(320),
  password: z
    .string()
    .trim()
    .min(1, { message: "La contraseña es obligatoria" }),
});
