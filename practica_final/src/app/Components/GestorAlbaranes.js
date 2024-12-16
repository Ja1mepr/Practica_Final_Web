export default function GestorAlbaranes({
  albaranes,
  onSelectAlbaranId,
  deleteAlbaran,
  onCreateAlbaran,
}) 
{

  return (
    <div className="bg-gray-100 p-4 rounded shadow h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Listado de Albaranes</h1>
      <ul className="mt-4 space-y-2">
        {albaranes.map((albaran) => (
          <li
            key={albaran._id} // Clave única con _id
            className="p-4 bg-white rounded shadow flex justify-between items-center cursor-pointer"
            onClick={() => onSelectAlbaranId(albaran._id)}
          >
            <div>
              <p className="font-medium">
                Cliente: {albaran.clientName || "Sin asignar"}
              </p>
              <p className="text-sm text-gray-500">
                Proyecto: {albaran.projectName || "Sin asignar"}
              </p>
              <p className="text-sm text-gray-500">
                Descripción: {albaran.description}
              </p>
              <p className="text-sm text-gray-500">
                Fecha: {albaran.workdate || "Sin fecha"}
              </p>
            </div>
            <div className="ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAlbaran(albaran._id);
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
        onClick={onCreateAlbaran}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
      >
        Crear Albarán
      </button>
    </div>
  );
}