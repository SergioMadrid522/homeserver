import { useForm, SubmitHandler } from "react-hook-form";
import type { LoginForm } from "./types";
import { LoginSchema } from "./schemas/login.schema";
import toast from "react-hot-toast";
import { AUTH_ENDPOINTS } from "@/config/auth";

export function useLogin() {
  const { register, handleSubmit, reset } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const result = LoginSchema.safeParse(data);

    if (!result.success) {
      const formatted = result.error.issues[0].message;
      toast.error(formatted);
      return;
    }
    try {
      const res = await fetch(AUTH_ENDPOINTS.login, {
        method: "POST",
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
    } catch (error: any) {
      console.log(error);
    }
  };
  return {
    register,
    handleSubmit,
    onSubmit,
  };
}
