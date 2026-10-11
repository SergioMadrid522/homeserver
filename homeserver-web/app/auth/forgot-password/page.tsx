import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-5">
      <Form />
    </div>
  );
}

function Titles() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="m-0 font-bold uppercase text-[#2563eb]">AMCloud Server</h1>

      <h2>Recuperar contraseña</h2>
    </div>
  );
}

function Form() {
  return (
    <form className="w-md flex flex-col gap-5 p-4 border border-white/40 bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
      <Titles />

      <div className="flex flex-col">
        <label htmlFor="email" className="">
          Email
        </label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="example@example.com"
          className="py-2 border-b border-gray-300 focus:border-b-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="cursor-pointer bg-[#2563EB] text-white rounded-xl p-3 hover:bg-[#1d4ed8] transition-colors"
      >
        Recuperar
      </button>
    </form>
  );
}
