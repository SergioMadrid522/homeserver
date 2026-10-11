"use client";
import type { SignUpForm } from "./types";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { AUTH_ENDPOINTS } from "@/config/auth";
import { SignUpSchema } from "./schemas/signup.schema";
import { useRouter } from "next/navigation";

export function useSignUp() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<SignUpForm>({
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    const result = SignUpSchema.safeParse(data);

    if (!result.success) {
      const formatted = result.error.issues[0].message;
      toast.error(formatted);
      return;
    }

    try {
      const res = await fetch(AUTH_ENDPOINTS.singup, {
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
    } catch (error: any) {
      toast.error(error.message);
    }
    reset();
  };

  return {
    register,
    handleSubmit,
    onSubmit,
  };
}
