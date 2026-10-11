"use client";

import { useLogin } from "@/hooks/auth/useLogin";
import { Titles } from "../Titles";
import { Options } from "../Options";

export function Form() {
  const { register, handleSubmit, onSubmit } = useLogin();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        w-md flex flex-col 
        gap-5 p-4 
        border border-white/40 
        bg-white/10 backdrop-blur-md 
        rounded-xl shadow-xl"
    >
      <Titles title="Iniciar Sesión" />

      <div className="flex flex-col">
        <label htmlFor="email" className="">
          Email
        </label>
        <input
          type="text"
          {...register("email")}
          id="email"
          autoComplete="email"
          placeholder="example@example.com"
          className="py-2 border-b border-gray-300 focus:border-b-blue-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">
          <span className="" />
          Contraseña
          <span className="" />
        </label>
        <input
          type="password"
          {...register("password")}
          autoComplete="password"
          id="password"
          placeholder="••••••••••"
          className="py-2 border-b border-gray-300 focus:border-b-blue-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="cursor-pointer bg-[#2563EB] text-white rounded-xl p-3 hover:bg-[#1d4ed8] transition-colors"
      >
        Iniciar sesión
      </button>

      <Options form="login" />
    </form>
  );
}
