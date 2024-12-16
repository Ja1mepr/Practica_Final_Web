export default function GestorClientes({ clientes, onSelectClientId, deleteCliente, onCreateClient }) {

  return (
    <div className="bg-gray-100 p-4 rounded shadow h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Listado de Clientes</h1>
      <ul className="mt-4 space-y-2">
        {clientes.map((cliente) => (
          <li
            key={cliente._id} // Agrega el key único con _id
            className="p-4 bg-white rounded shadow flex justify-between items-center cursor-pointer"
            onClick={() => onSelectClientId(cliente._id)}
          >
            <div>
              <p className="font-medium">{cliente.name}</p>
              <p className="text-sm text-gray-500">{cliente.email}</p>
              <p className="text-sm text-gray-500">{cliente.phone}</p>
            </div>
            <div className="ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Evita que el clic en eliminar propague el evento de selección
                  deleteCliente(cliente._id);
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
        onClick={onCreateClient}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Crear Cliente
      </button>
    </div>
  );
}