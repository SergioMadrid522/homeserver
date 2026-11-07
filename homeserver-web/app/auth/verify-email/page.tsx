"use client";

import { Titles } from "@/components/auth/Titles";
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyResetCode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { loading, error, succesful, validateEmail } = useVerifyEmail();

  useEffect(() => {
    validateEmail(token!);
  }, [validateEmail, token]);

  useEffect(() => {
    if (!token || error) {
      return router.push("/");
    }

    if (!succesful) return;

    const timeout = setTimeout(() => {
      router.replace("/home");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [token, succesful, router, error]);

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-5">
      <Titles title="Verificación de email" />
      {loading && <p>Verificando correo electronico...</p>}
      {error && <p>{error}</p>}
      {succesful && (
        <p>
          Se ha verificado el correo electronico, en un momento será redirigido
          al Home.
        </p>
      )}
    </div>
  );
}
