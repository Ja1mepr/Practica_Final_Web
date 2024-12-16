import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Esta función se llama cada vez que el usuario escribe en la barra de búsqueda
  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term); // Actualiza el estado con el nuevo valor
    onSearch(term); // Llama a la función onSearch pasándole el valor actualizado
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm} // El valor del input es el estado searchTerm
        onChange={handleChange} // Se ejecuta al escribir en el input
        className="p-2 border rounded w-full"
      />
    </div>
  );
}