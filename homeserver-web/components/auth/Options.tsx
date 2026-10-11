import { Form } from "@/app/auth/types";
import Link from "next/link";

export function Options({ form }: { form: Form }) {
  return (
    <>
      {form === "login" ? (
        <div className="flex items-center justify-between">
          <Link
            href={"/auth/signup"}
            className="text-sm text-blue-500 hover:underline"
          >
            ¿Aún no estás registrado?
          </Link>
          <Link
            href={"/auth/forgot-password"}
            className="text-sm text-blue-500 hover:underline"
          >
            Olvidé mi contraseña
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Link
            href={"/auth/login"}
            className="justify-center text-sm text-blue-500 hover:underline"
          >
            ¿Ya tienes cuenta?
          </Link>
        </div>
      )}
    </>
  );
}
