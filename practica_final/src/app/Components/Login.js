"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  // Validación con Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("El correo no es válido")
      .required("El correo es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    console.log(values.email);
    console.log(values.password);

    try {
      const response = await axios.post(
        "https://bildy-rpmaya.koyeb.app/api/user/login",
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        const token = response.data?.token;
        if (token) {
          localStorage.setItem("jwt", token);
          alert("Inicio de sesión exitoso. Redirigiendo al panel...");
          router.push("/overView/Resumen");
        } else {
          alert("Inicio de sesión exitoso, pero no se recibió un token.");
        }
      } else {
        alert("Error desconocido al iniciar sesión. Por favor, inténtalo nuevamente.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Ocurrió un error inesperado.";
      alert(`Error al iniciar sesión: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
