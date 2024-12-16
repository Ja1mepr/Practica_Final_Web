"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [isVerificationStage, setIsVerificationStage] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Validación con Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("El correo no es válido")
      .required("El correo es obligatorio"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
  });

  const handleRegister = async (values, { setSubmitting }) => {
    console.log(values.email);
    console.log(values.password);
  
    try {
      const response = await axios.post(
        "https://bildy-rpmaya.koyeb.app/api/user/register",
        {
          email: values.email,
          password: values.password,
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        const token = response.data?.token;
        if (token) {
          localStorage.setItem("jwt", token);
          alert("Registro exitoso. Revisa tu correo para el código de verificación.");
          setIsVerificationStage(true);
        } else {
          alert("Registro exitoso, pero no se recibió un token.");
        }
      } else {
        alert("Error desconocido al registrarse. Por favor, inténtalo nuevamente.");
      }
    } catch (error) {
      console.error("Error al registrar:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Ocurrió un error inesperado.";
      alert(`Error al registrarse: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("No se encontró el token de sesión. Por favor, regístrate de nuevo.");
      return;
    }

    try {
      const response = await axios.put(
        "https://bildy-rpmaya.koyeb.app/api/user/validation",
        { code: verificationCode },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Correo verificado exitosamente. Ahora puedes iniciar sesión.");
        router.push("/Login");
      } else {
        alert("Error al verificar el correo. Por favor, inténtalo nuevamente.");
      }
    } catch (error) {
      console.error("Error al verificar el correo:", error.response?.data || error.message);
      alert("Error al verificar el correo. Verifica el código e inténtalo nuevamente.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Registro</h1>
      {!isVerificationStage ? (
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
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
                  {isSubmitting ? "Registrando..." : "Registrarse"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <form onSubmit={handleVerification}>
          <div className="mb-4">
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
              Código de Verificación
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Verificar Correo
            </button>
          </div>
        </form>
      )}
    </div>
  );
}