export default function GestorProyectos({
    proyectos,
    onSelectProjectClientId,
    deleteProyecto,
    onCreateProject,
    onEditProject, 
}) {
    return (
        <div className="bg-gray-100 p-4 rounded shadow h-full overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">Listado de Proyectos</h1>
            <ul className="mt-4 space-y-2">
                {proyectos.map((proyecto) => (
                    <li
                        key={proyecto._id}
                        className="p-4 bg-white rounded shadow flex justify-between items-center"
                    >
                        <div
                            className="cursor-pointer"
                            onClick={() => onSelectProjectClientId(proyecto.clientId)}
                        >
                            <p className="font-medium">{proyecto.name}</p>
                            <p className="text-sm text-gray-500">Código: {proyecto.code}</p>
                            <p className="text-sm text-gray-500">Creado: {new Date(proyecto.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="ml-4 flex space-x-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditProject(proyecto);
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Editar
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteProyecto(proyecto._id);
                                }}
                                className="text-red-500 hover:underline"
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                onClick={onCreateProject}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Crear Proyecto
            </button>
        </div>
    );
}