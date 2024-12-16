"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoggedIn(true);
      // Redirige a Resumen si el usuario ya está logado
      router.push("./overView/Resumen");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-blue-100 py-10">
        {!isLoggedIn && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Bienvenido a Bildy</h1>
            <p className="text-lg mb-6">
              ¡Regístrate o inicia sesión para comenzar a usar Bildy y gestionar tus proyectos!
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}