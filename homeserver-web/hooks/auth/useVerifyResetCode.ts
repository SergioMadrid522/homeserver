import { SubmitHandler, useForm } from "react-hook-form";
import type { VerifyResetCodeForm } from "./types";
import { VerifyResetCodeSchema } from "./schemas/verify-reset-code.schema";
import toast from "react-hot-toast";
import { AUTH_ENDPOINTS } from "@/config/auth";

export function useVerifyResetCode() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<VerifyResetCodeForm>({
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<VerifyResetCodeForm> = async (data) => {
    const result = VerifyResetCodeSchema.safeParse(data);

    if (!result.success) {
      const formatted = result.error.issues[0].message;
      toast.error(formatted);
      return;
    }

    try {
      const res = await fetch(AUTH_ENDPOINTS.verifyResetCode, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (!res.ok) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      reset();
    } catch (error) {}

    reset();
  };

  return {
    isSubmitting,
    register,
    handleSubmit,
    onSubmit,
  };
}
