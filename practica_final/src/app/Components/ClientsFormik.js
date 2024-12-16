"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default function ClientFormik() {
  // Función para manejar el envío del formulario
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const token = localStorage.getItem("jwt");

      // Reorganizar los valores para que coincidan con el formato de la API
      const payload = {
        name: values.name,
        address: {
          street: values.street,
          number: parseInt(values.number, 10),
          postal: parseInt(values.postal, 10),
          city: values.city,
          province: values.province,
        },
        cif: values.cif,
      };

      const response = await axios.post(
        "https://bildy-rpmaya.koyeb.app/api/client",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Cliente creado con éxito:", response.data);
      resetForm();
    } catch (error) {
      console.error("Error al crear cliente:", error.response?.data || error);
    }
  };

  // Esquema de validación usando Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("El nombre es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    street: Yup.string().required("La calle es obligatoria"),
    number: Yup.number()
      .required("El número es obligatorio")
      .typeError("El número debe ser un valor numérico"),
    postal: Yup.number()
      .required("El código postal es obligatorio")
      .typeError("El código postal debe ser un valor numérico"),
    city: Yup.string().required("La ciudad es obligatoria"),
    province: Yup.string().required("La provincia es obligatoria"),
    cif: Yup.string()
      .required("El CIF es obligatorio")
      .matches(/^[A-Za-z0-9]+$/, "El CIF debe ser válido"),
  });

  // Valores iniciales del formulario
  const initialValues = {
    name: "",
    street: "",
    number: "",
    postal: "",
    city: "",
    province: "",
    cif: "",
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Crear Cliente</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Nombre */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Ej: Juan Pérez"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Dirección */}
            <div className="mb-4">
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700"
              >
                Calle
              </label>
              <Field
                type="text"
                name="street"
                id="street"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Ej: Carlos III"
              />
              <ErrorMessage
                name="street"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="number"
                className="block text-sm font-medium text-gray-700"
              >
                Número
              </label>
              <Field
                type="text"
                name="number"
                id="number"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Ej: 22"
              />
              <ErrorMessage
                name="number"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="postal"
                className="block text-sm font-medium text-gray-700"
              >
                Código Postal
              </label>
              <Field
                type="text"
                name="postal"
                id="postal"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Ej: 28936"
              />
              <ErrorMessage
                name="postal"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                Ciudad
              </label>
              <Field
                type="text"
                name="city"
                id="city"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Ej: Móstoles"
              />
              <ErrorMessage
                name="city"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-700"
              >
                Provincia
              </label>
              <Field
                type="text"
                name="province"
                id="province"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Ej: Madrid"
              />
              <ErrorMessage
                name="province"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* CIF */}
            <div className="mb-4">
              <label
                htmlFor="cif"
                className="block text-sm font-medium text-gray-700"
              >
                CIF
              </label>
              <Field
                type="text"
                name="cif"
                id="cif"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Ej: A12345678"
              />
              <ErrorMessage
                name="cif"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Botón de envío */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}