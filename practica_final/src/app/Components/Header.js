"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";

export default function Header({ onSearch }) {
  const router = useRouter();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const user = JSON.parse(atob(token.split(".")[1]));
        setUsername(user?.username || "Usuario");
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem("jwt");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setUsername(null);
    alert("Sesión cerrada exitosamente.");
    router.push("/");
  };

  return (
    <header className="bg-blue-500 text-white py-4 px-6 shadow-md flex justify-between items-center">
      <h1 className="w-64 text-3xl font-bold">Bildy</h1>

      <div className="flex items-center space-x-4 w-full max-w-6xl">
        <div className="flex-grow mr-4">
          <SearchBar onSearch={onSearch} />
        </div>
        <div className="flex items-center space-x-4">
          {username ? (
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white border border-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Cerrar Sesión
            </button>
          ) : (
            <div className="space-x-4">
              <button
                onClick={() => router.push("/Register")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Registrarse
              </button>
              <button
                onClick={() => router.push("/Login")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}