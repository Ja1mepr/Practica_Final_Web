"use client";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";

export default function AlbaranesFormik({
  clients,
  projects,
  onSubmit,
  initialValues,
}) {
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    if (initialValues?.clientId) {
      filterProjects(initialValues.clientId);
    }
  }, [initialValues]);

  // Filtra los proyectos asociados al cliente
  const filterProjects = (clientId) => {
    const clientProjects = projects.filter(
      (project) => project.clientId === clientId
    );
    setFilteredProjects(clientProjects);
  };

  const validationSchema = Yup.object({
    clientId: Yup.string().required("El cliente es obligatorio"),
    projectId: Yup.string().required("El proyecto es obligatorio"),
    description: Yup.string()
      .required("La descripción es obligatoria")
      .min(5, "La descripción debe tener al menos 5 caracteres"),
    format: Yup.string().oneOf(["material", "hours"], "Formato inválido"),
    material: Yup.string().when("format", {
      is: "material",
      then: Yup.string().required("El tipo de material es obligatorio"),
    }),
    hours: Yup.number().when("format", {
      is: "hours",
      then: Yup.number().required("Las horas son obligatorias").min(1, "Debe ser al menos 1 hora"),
    }),
    workdate: Yup.date().nullable().notRequired(),
  });

  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Crear Albarán</h2>
      <Formik
        initialValues={initialValues || {
          clientId: "",
          projectId: "",
          description: "",
          format: "",
          material: "N/A", // valor por defecto de material
          hours: 0,         // valor por defecto de hours
          workdate: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="mb-4">
              <label
                htmlFor="clientId"
                className="block text-sm font-medium text-gray-700"
              >
                Cliente
              </label>
              <Field
                as="select"
                name="clientId"
                id="clientId"
                className="mt-1 p-2 border rounded w-full"
                onChange={(e) => {
                  const selectedClientId = e.target.value;
                  setFieldValue("clientId", selectedClientId);
                  filterProjects(selectedClientId);
                  setFieldValue("projectId", "");
                }}
              >
                <option value="">Seleccionar Cliente</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="clientId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="projectId"
                className="block text-sm font-medium text-gray-700"
              >
                Proyecto
              </label>
              <Field
                as="select"
                name="projectId"
                id="projectId"
                className="mt-1 p-2 border rounded w-full"
                disabled={!values.clientId}
              >
                <option value="">Seleccionar Proyecto</option>
                {filteredProjects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="projectId"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción
              </label>
              <Field
                type="text"
                name="description"
                id="description"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Descripción del albarán"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="format"
                className="block text-sm font-medium text-gray-700"
              >
                Formato
              </label>
              <Field
                as="select"
                name="format"
                id="format"
                className="mt-1 p-2 border rounded w-full"
                onChange={(e) => {
                  const selectedFormat = e.target.value;
                  setFieldValue("format", selectedFormat);
                  // Resetear los valores de material y horas cuando cambia el formato
                  setFieldValue("material", selectedFormat === "material" ? "N/A" : ""); // Valor predeterminado para material
                  setFieldValue("hours", selectedFormat === "hours" ? 0 : 0); // Valor predeterminado para hours
                  setFieldValue("workdate", "");
                }}
              >
                <option value="">Seleccionar formato</option>
                <option value="material">Material</option>
                <option value="hours">Horas</option>
              </Field>
              <ErrorMessage
                name="format"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {values.format === "material" && (
              <div className="mb-4">
                <label
                  htmlFor="material"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipo de Material
                </label>
                <Field
                  type="text"
                  name="material"
                  id="material"
                  className="mt-1 p-2 border rounded w-full"
                  placeholder="Tipo de material"
                />
                <ErrorMessage
                  name="material"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            {values.format === "hours" && (
              <div className="mb-4">
                <label
                  htmlFor="hours"
                  className="block text-sm font-medium text-gray-700"
                >
                  Horas
                </label>
                <Field
                  type="number"
                  name="hours"
                  id="hours"
                  className="mt-1 p-2 border rounded w-full"
                  placeholder="Horas de trabajo"
                />
                <ErrorMessage
                  name="hours"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="workdate"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de trabajo
              </label>
              <Field
                type="date"
                name="workdate"
                id="workdate"
                className="mt-1 p-2 border rounded w-full"
              />
              <ErrorMessage
                name="workdate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

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