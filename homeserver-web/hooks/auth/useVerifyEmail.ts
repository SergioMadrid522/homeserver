import toast from "react-hot-toast";
import { AUTH_ENDPOINTS } from "@/config/auth";
import { useCallback, useState } from "react";

export function useVerifyEmail() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [succesful, setSuccesful] = useState(false);

  const validateEmail = useCallback(async (token: string) => {
    if (!token) {
      toast.error("No existe ningún token");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${AUTH_ENDPOINTS.validateEmail}?token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const response = await res.json();

      if (!res.ok) {
        setSuccesful(false);
        setError(response.mensaje);
        toast.error(response.message);
        return;
      }
      setSuccesful(true);
      toast.success(response.message);
    } catch (error) {
      setSuccesful(false);
      setError(error.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    succesful,
    validateEmail,
  };
}
