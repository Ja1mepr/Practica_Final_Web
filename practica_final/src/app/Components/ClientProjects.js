import { useState } from "react";
import ProjectsFormik from "./ProjectsFormik";

export default function ClientProjects({ clients, clientId, proyectos, handleCreateProject }) {
  const [isCreating, setIsCreating] = useState(false);

  // Filtrar proyectos por el id del cliente
  const proyectosFiltrados = proyectos.filter((proyecto) => proyecto.clientId === clientId);

  const onCreateProject = (newProject) => {
    const projectWithClientId = { ...newProject, clientId };
    handleCreateProject(projectWithClientId);
    setIsCreating(false);
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Proyectos del Cliente</h2>

      {isCreating ? (
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold mb-4">Crear Proyecto</h3>
          <ProjectsFormik
            clients={clients}
            clienteId={clientId}
            onSubmit={onCreateProject} // Envía los datos del proyecto al formulario
            onCancel={() => setIsCreating(false)} // Cancela la creación y oculta el formulario
          />
        </div>

      ) : (
        <>
          {proyectosFiltrados.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {proyectosFiltrados.map((proyecto) => {
                // Verifica si _id es válido, de lo contrario usa otro valor único como proyecto.code
                const key = proyecto._id || proyecto.code;  // Usa _id o code como fallback si _id no es válido
                return (
                  <li
                    key={key}  // Asegura que cada li tenga un key único
                    className="p-4 bg-white rounded shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{proyecto.name}</p>
                      <p className="text-sm text-gray-500">Código: {proyecto.code}</p>
                      <p className="text-sm text-gray-500">Creado: {proyecto.creationDate}</p>
                      <p className="text-sm text-gray-500">
                        Estado:{" "}
                        <span
                          className={
                            proyecto.status === "complete"
                              ? "text-green-500"
                              : proyecto.status === "canceled"
                                ? "text-red-500"
                                : "text-yellow-500"
                          }
                        >
                          {proyecto.status}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">No hay proyectos asociados a este cliente.</p>
          )}
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsCreating(true)}
          >
            Crear Proyecto
          </button>
        </>
      )}
    </div>
  );
}