"use client";
import { useState, useEffect } from "react";

export default function Client({ cliente, isEditing, onEdit, onSave, onCancel }) {
  const [editedClient, setEditedClient] = useState(cliente || {});

  // Actualizar los datos del cliente cuando cambie la selección
  useEffect(() => {
    setEditedClient(cliente || {});
  }, [cliente]);

  if (!cliente) return <div>Selecciona un cliente para ver su información.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prev) => {
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
      <h2 className="text-xl font-bold mb-2">Información del Cliente</h2>
      {isEditing ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nombre:
              <input
                type="text"
                name="name"
                value={editedClient.name || ""}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              CIF:
              <input
                type="text"
                name="cif"
                value={editedClient.cif || ""}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Dirección:
              <input
                type="text"
                name="address.street"
                value={editedClient.address?.street || ""}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                placeholder="Calle"
              />
              <input
                type="text"
                name="address.number"
                value={editedClient.address?.number || ""}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
                placeholder="Número"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSave(editedClient)}
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
            <strong>Nombre:</strong> {cliente.name}
          </p>
          <p>
            <strong>CIF:</strong> {cliente.cif}
          </p>
          <p>
            <strong>Dirección:</strong>{" "}
            {cliente.address
              ? `${cliente.address.street}, ${cliente.address.number}`
              : "No especificada"}
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