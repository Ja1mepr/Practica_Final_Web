import Link from "next/link";
import "../styles/globals.css";

export default function Navbar() {
  return (
    <div className="h-screen w-48 bg-blue-500 text-white flex flex-col items-center py-6">
      <nav className="w-full">
        <ul className="space-y-4 text-center">
          <li>
            <Link
              href="../overView/Resumen"
              className="block py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Resumen
            </Link>
          </li>
          <li>
            <Link
              href="../Clientes"
              className="block py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Clientes
            </Link>
          </li>
          <li>
            <Link
              href="../Proyectos"
              className="block py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Proyectos
            </Link>
          </li>
          <li>
            <Link
              href="../Albaranes"
              className="block py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Albaranes
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}