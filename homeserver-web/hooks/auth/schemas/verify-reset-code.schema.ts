import * as z from "zod";

export const VerifyResetCodeSchema = z.object({
  code: z.string().trim().nonempty().max(6),
});
