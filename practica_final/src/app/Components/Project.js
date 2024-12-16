"use client";
import { useState, useEffect } from "react";

export default function Project({ 
  proyecto, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel 
}) {
  const [editedProject, setEditedProject] = useState(proyecto || {});

  // Actualizar los datos del proyecto cuando cambie la selección
  useEffect(() => {
    setEditedProject(proyecto || {});
  }, [proyecto]);

  if (!proyecto) return <div>Selecciona un proyecto para ver su información.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProject((prev) => {
      const keys = name.split(".");
      if (keys.length > 1) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Información del Proyecto</h2>
      {isEditing ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Proyecto:
              <input
                type="text"
                name="name"
                value={editedProject.name || ""}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Código del Proyecto:
              <input
                type="text"
                name="code"
                value={editedProject.code || ""}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSave(editedProject)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600"
            >
              Guardar
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <p>
            <strong>Nombre del Proyecto:</strong> {proyecto.name}
          </p>
          <p>
            <strong>Código del Proyecto:</strong> {proyecto.code}
          </p>
          <button
            onClick={onEdit}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Editar Información
          </button>
        </>
      )}
    </div>
  );
}