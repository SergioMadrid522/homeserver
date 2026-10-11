import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href={"/auth/login"}>Iniciar sesión</Link>
          </li>
          <li>
            <Link href={"/auth/signup"}>Registrarse</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
