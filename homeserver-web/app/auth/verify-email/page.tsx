"use client";

import { Titles } from "@/components/auth/Titles";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyResetCode() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
  }, [token, router]);

  if (!token) return null;

  setTimeout(() => {
    router.push("/home");
  }, 3000);

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-5">
      <Titles title="Verificación de email" />
      <p>
        Se ha verificado el correo electronico, en un momento será redirigido al
        Home.
      </p>
    </div>
  );
}
