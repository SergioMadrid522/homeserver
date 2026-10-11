"use client";

import { useVerifyResetCode } from "@/hooks/auth/useVerifyResetCode";
import { Titles } from "../Titles";

export function Form() {
  const { isSubmitting, register, handleSubmit, onSubmit } =
    useVerifyResetCode();

  return (
    <form
      className="
        w-md flex flex-col 
        gap-5 p-4 
        border border-white/40 
        bg-white/10 backdrop-blur-md 
        rounded-xl shadow-xl"
    >
      <Titles title="Recuperar contraseña" />

      <div className="flex flex-col">
        <label htmlFor="code" className="">
          Código de verificación
        </label>
        <input
          type="text"
          id="code"
          autoComplete="code"
          placeholder="000000"
          className="py-2 border-b border-gray-300 focus:border-b-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer bg-[#2563EB] text-white rounded-xl p-3 hover:bg-[#1d4ed8] transition-colors"
      >
        {isSubmitting ? "verificando..." : "Validar código"}
      </button>
    </form>
  );
}
